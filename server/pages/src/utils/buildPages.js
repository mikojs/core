// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';
import debug from 'debug';

import { mergeDir, requireModule } from '@mikojs/utils';
import {
  type mergeDirEventType,
  type mergeDirDataType,
} from '@mikojs/utils/lib/mergeDir';
import { type optionsType } from '@mikojs/server';
import getPathname from '@mikojs/server/lib/utils/getPathname';
import {
  type pageComponentType,
  type propsType as ssrPropsType,
} from '@mikojs/react-ssr';

import templates from 'templates';

type routeDataType = {|
  ...$ElementType<$PropertyType<ssrPropsType, 'routesData'>, number>,
  filePath: string,
|};

type cacheType = {|
  document: string,
  main: string,
  loading: string,
  error: string,
  routesData: $ReadOnlyArray<routeDataType>,
  addRouteData: (event: mergeDirEventType, options: mergeDirDataType) => void,
|};

const debugLog = debug('pages:buildPages');

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {cacheType} - routes cache
 */
export default (folderPath: string, options: optionsType) => {
  const {
    dev = process.env.NODE_ENV !== 'production',
    logger = emptyFunction,
    basename,
    ...mergeDirOptions
  } = options;
  const cache: cacheType = {
    ...templates,
    routesData: [],
    addRouteData: (
      event: mergeDirEventType,
      { filePath, name, extension }: mergeDirDataType,
    ) => {
      const pathname = getPathname(folderPath, basename, {
        filePath,
        name,
        extension,
      });

      cache.routesData = cache.routesData.filter(
        ({ filePath: currentFilePath }: routeDataType) =>
          currentFilePath !== filePath,
      );

      if (event !== 'unlink')
        cache.routesData = [
          ...cache.routesData,
          {
            exact: true,
            path: pathname,
            component: {
              chunkName: `pages${pathname.replace(/\*$/, 'notFound')}`,
              loader: async () => ({
                default: requireModule<pageComponentType<*, *>>(filePath),
              }),
            },
            filePath,
          },
        ].sort((a: routeDataType, b: routeDataType): number => {
          if ((/\*$/, test(a.path))) return -1;

          const pathALength = [...a.path.matchAll(/\//g)].length;
          const pathBLength = [...b.path.matchAll(/\//g)].length;

          if (pathALength !== pathBLength)
            return pathALength > pathBLength ? -1 : 1;

          return !/\/:([^[\]]*)/.test(a.path) ? -1 : 1;
        });
    },
  };

  mergeDir(
    folderPath,
    {
      ...mergeDirOptions,
      watch: dev,
      extensions: /\.js$/,
    },
    (
      event: mergeDirEventType,
      { filePath, name, extension }: mergeDirDataType,
    ) => {
      logger('start', event, filePath);

      if (['init', 'add', 'change', 'unlink'].includes(event)) {
        if (/^\.templates/.test(path.resolve(folderPath, filePath))) {
          const filename = name.replace(extension, '').toLowerCase();

          switch (filename) {
            case 'document':
            case 'main':
            case 'loading':
            case 'error':
              cache[filename] =
                event !== 'unlink' ? filePath : templates[filename];
              break;

            case 'notfound':
              cache.addRouteData(event, { filePath, name: '*.js', extension });
              break;

            default:
              break;
          }
        } else cache.addRouteData(event, { filePath, name, extension });
      }

      debugLog(cache);
      logger('end', event, filePath);
    },
  );
};
