// @flow

import path from 'path';

import debug from 'debug';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';
import { type propsType as ssrPropsType } from '@mikojs/react-ssr';

import { type optionsType } from '../index';

import getRouteData from './getRouteData';
import getFileType from './getFileType';

export type cacheType = {|
  document: string,
  main: string,
  loading: string,
  error: string,
  routesData: $ReadOnlyArray<{|
    ...$ElementType<$PropertyType<ssrPropsType, 'routesData'>, number>,
    filePath: string,
  |}>,
|};

const debugLog = debug('react:build-cache');

/**
 * @example
 * buildCache('/', {}, getPath)
 *
 * @param {string} folderPath - the folder path
 * @param {optionsType} options - koa react options
 * @param {Function} getPath - get path function
 *
 * @return {cacheType} - cache data
 */
export default (
  folderPath: string,
  { extensions = /\.js$/, exclude }: optionsType,
  getPath: (relativePath: string) => string,
): cacheType => {
  const cache = {
    document: path.resolve(__dirname, '../templates/Document.js'),
    main: path.resolve(__dirname, '../templates/Main.js'),
    loading: path.resolve(__dirname, '../templates/Loading.js'),
    error: path.resolve(__dirname, '../templates/Error.js'),
    routesData: [
      getRouteData(
        '*',
        path.resolve(__dirname, '../templates/NotFound.js'),
        getPath,
      ),
    ],
  };

  debugLog(cache);
  d3DirTree(folderPath, {
    extensions,
    exclude,
  })
    .leaves()
    .forEach(({ data: { name, path: filePath } }: d3DirTreeNodeType) => {
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
            '*',
            filePath,
            getPath,
          );
          break;

        case 'page':
          cache.routesData = [
            getRouteData(fileType.relativePath, filePath, getPath),
            ...cache.routesData,
          ];
          break;

        default:
          break;
      }
    });

  debugLog(cache);

  return cache;
};
