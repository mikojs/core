// @flow

import path from 'path';

import debug from 'debug';

import { type propsType as ssrPropsType } from '@mikojs/react-ssr';

import { type optionsType } from '../index';

import getFileType from './getFileType';
import getRouteData from './getRouteData';

export type cacheType = {|
  document: string,
  main: string,
  loading: string,
  error: string,
  routesData: $ReadOnlyArray<{|
    ...$ElementType<$PropertyType<ssrPropsType, 'routesData'>, number>,
    filePath: string,
  |}>,
  addPage: (filePath: string) => void,
|};

const debugLog = debug('react:getCache');

/**
 * @example
 * getCache('/', {})
 *
 * @param {string} folderPath - the folder path
 * @param {optionsType} options - koa react options
 *
 * @return {cacheType} - cache data
 */
export default (
  folderPath: string,
  { extensions = /\.js$/, basename }: optionsType,
): cacheType => {
  const cache = {
    document: path.resolve(__dirname, '../templates/Document.js'),
    main: path.resolve(__dirname, '../templates/Main.js'),
    loading: path.resolve(__dirname, '../templates/Loading.js'),
    error: path.resolve(__dirname, '../templates/Error.js'),
    routesData: [
      getRouteData(
        basename,
        '*',
        path.resolve(__dirname, '../templates/NotFound.js'),
      ),
    ],
    addPage: (filePath: string) => {
      const fileType = getFileType(folderPath, extensions, filePath);

      debugLog(fileType);
      switch (fileType.type) {
        case 'document':
          cache.document = filePath;
          break;

        case 'main':
          cache.main = filePath;
          break;

        case 'loading':
          cache.loading = filePath;
          break;

        case 'error':
          cache.error = filePath;
          break;

        case 'not-found':
          cache.routesData[cache.routesData.length - 1] = getRouteData(
            basename,
            '*',
            filePath,
          );
          break;

        case 'page':
          const routeData = getRouteData(
            basename,
            fileType.relativePath,
            filePath,
          );

          cache.routesData = [
            routeData,
            ...cache.routesData.filter(
              ({
                component: { chunkName },
              }: $ElementType<
                $PropertyType<cacheType, 'routesData'>,
                number,
              >) => chunkName !== routeData.component.chunkName,
            ),
          ];
          break;

        default:
          break;
      }

      debugLog(cache);
    },
  };

  debugLog(cache);

  return cache;
};
