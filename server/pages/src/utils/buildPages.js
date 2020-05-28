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

type pageType = {|
  ...$ElementType<$PropertyType<ssrPropsType, 'routesData'>, number>,
  filePath: string,
|};

type cacheType = {|
  document: string,
  main: string,
  loading: string,
  error: string,
  pages: $ReadOnlyArray<pageType>,
  addPage: (event: mergeDirEventType, options: mergeDirDataType) => void,
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
    pages: [],
    addPage: (
      event: mergeDirEventType,
      { filePath, name, extension }: mergeDirDataType,
    ) => {
      const pathname = getPathname(folderPath, basename, {
        filePath,
        name,
        extension,
      });

      cache.pages = cache.pages.filter(
        ({ filePath: currentFilePath }: pageType) =>
          currentFilePath !== filePath,
      );

      if (event !== 'unlink')
        cache.pages = [
          ...cache.pages,
          {
            exact: true,
            path: [pathname],
            component: {
              chunkName: `pages${pathname.replace(/\*$/, 'notFound')}`,
              loader: async () => ({
                default: requireModule<pageComponentType<*, *>>(filePath),
              }),
            },
            filePath,
          },
        ];
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
              cache.addPage(event, { filePath, name: '*.js', extension });
              break;

            default:
              break;
          }
        }
      }

      debugLog(cache);
      logger('end', event, filePath);
    },
  );
};
