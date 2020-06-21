// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';
import debug from 'debug';

import { mergeDir, requireModule } from '@mikojs/utils';
import {
  type mergeDirEventType,
  type mergeDirDataType,
} from '@mikojs/utils/lib/mergeDir';
import { type optionsType as serverOptionsType } from '@mikojs/server';
import getPathname from '@mikojs/server/lib/utils/getPathname';
import { type pageComponentType } from '@mikojs/react-ssr';

import { type routesType } from '../index';

import templates from 'templates';

export type optionsType = serverOptionsType;

type routeType = $ElementType<$PropertyType<routesType, 'cache'>, number>;

const debugLog = debug('pages:buildRoutes');
const defaultNotFountMergeData = {
  filePath: path.resolve(__dirname, '../templates/NotFound.js'),
  name: 'NotFound.js',
  extension: '.js',
};

/**
 * @param {routesType} routes - routes
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 */
export default (
  routes: routesType,
  folderPath: string,
  options: optionsType,
) => {
  const {
    dev = process.env.NODE_ENV !== 'production',
    logger = emptyFunction,
    basename,
    ...mergeDirOptions
  } = options;
  const cache = {
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

      routes.cache = routes.cache.filter(
        ({ path: currentPathname }: routeType) => currentPathname !== pathname,
      );
      routes.filePaths[pathname] = filePath;

      if (event !== 'unlink' || isNotFound)
        routes.cache = [
          ...routes.cache,
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

          if (/\*$/.test(a.path)) return 1;

          if (/\*$/.test(b.path)) return -1;

          return !/\/:([^[\]]*)/.test(a.path) ? -1 : 1;
        });
    },
  };

  cache.addRoute('add', defaultNotFountMergeData, true);
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
              routes.templates[filename] =
                event !== 'unlink' ? filePath : templates[filename];
              break;

            case 'notfound':
              cache.addRoute(
                event,
                event === 'unlink'
                  ? defaultNotFountMergeData
                  : { filePath, name, extension },
                true,
              );
              break;

            default:
              break;
          }
        } else cache.addRoute(event, { filePath, name, extension }, false);

        if (event !== 'init') routes.events.emit('build');
      }

      debugLog(routes.templates);
      debugLog(routes.cache);
      logger('end', event, filePath);
    },
  );
  routes.events.emit('build');
};
