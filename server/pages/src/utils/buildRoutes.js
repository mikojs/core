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

type routeType = $ElementType<$PropertyType<ssrPropsType, 'routes'>, number>;

export type routesType = {|
  document: string,
  main: string,
  loading: string,
  error: string,
  routes: $ReadOnlyArray<routeType>,
  filePaths: {
    [string]: string,
  },
  get: () => $ReadOnlyArray<routeType>,
  getFilePath: (pathname: string) => string,
  addRoute: (
    event: mergeDirEventType,
    options: mergeDirDataType,
    isNotFound: boolean,
  ) => void,
|};

const debugLog = debug('pages:buildRoutes');

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {routesType} - routes cache
 */
export default (folderPath: string, options: optionsType): routesType => {
  const {
    dev = process.env.NODE_ENV !== 'production',
    logger = emptyFunction,
    basename,
    ...mergeDirOptions
  } = options;
  const cache: routesType = {
    ...templates,
    routes: [],
    filePaths: {},
    get: () => cache.routes,
    getFilePath: (pathname: string) => cache.filePaths[pathname],
    addRoute: (
      event: mergeDirEventType,
      { filePath, name, extension }: mergeDirDataType,
      isNotFound: boolean,
    ) => {
      const pathname = isNotFound
        ? `/${[basename, '*'].filter(Boolean).join('/')}`
        : getPathname(folderPath, basename, {
            filePath,
            name,
            extension,
          });

      cache.routes = cache.routes.filter(
        ({ path: currentPathname }: routeType) => currentPathname !== pathname,
      );
      cache.filePaths[pathname] = filePath;

      if (event !== 'unlink')
        cache.routes = [
          ...cache.routes,
          {
            exact: true,
            path: pathname,
            component: {
              chunkName: [
                isNotFound ? 'template' : 'pages',
                pathname.replace(/\*$/, 'notFound').replace(/\/$/, '/index'),
              ].join(''),
              loader: async () => ({
                default: requireModule<pageComponentType<*, *>>(filePath),
              }),
            },
          },
        ].sort((a: routeType, b: routeType): number => {
          const pathALength = [...a.path.replace(/\/\*$/, '').matchAll(/\//g)]
            .length;
          const pathBLength = [...b.path.replace(/\/\*$/, '').matchAll(/\//g)]
            .length;

          if (pathALength !== pathBLength)
            return pathALength > pathBLength ? -1 : 1;

          if (/\*$/.test(a.path)) return -1;

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
        if (/^\.templates/.test(path.relative(folderPath, filePath))) {
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
              cache.addRoute(event, { filePath, name, extension }, true);
              break;

            default:
              break;
          }
        } else cache.addRoute(event, { filePath, name, extension }, false);
      }

      debugLog(cache);
      logger('end', event, filePath);
    },
  );

  return cache;
};