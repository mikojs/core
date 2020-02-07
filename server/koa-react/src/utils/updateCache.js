// @flow

import path from 'path';

import { type optionsType } from '../index';

import { type cacheType } from './buildCache';
import getFileType from './getFileType';
import getRouteData from './getRouteData';
import writeClient from './writeClient';

/**
 * @example
 * updateCache('/folderPath', {}, cache, '/filePath')
 *
 * @param {string} folderPath - the folder path
 * @param {optionsType} options - koa graphql options
 * @param {cacheType} cache - koa react cache
 * @param {Function} getPath - get path function
 * @param {string} filePath - the file path
 */
export default (
  folderPath: string,
  {
    extensions = /\.js$/,
    exclude,
    makeExecutableSchemaOptions: { resolverValidationOptions } = {},
  }: optionsType,
  cache: cacheType,
  getPath: (relativePath: string) => string,
  filePath: string,
) => {
  if (
    !extensions.test(filePath) ||
    exclude?.test(filePath) ||
    !new RegExp(path.resolve(folderPath)).test(filePath)
  )
    return;

  const fileType = getFileType(folderPath, extensions, filePath);

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
      const routeData = getRouteData(fileType.relativePath, filePath, getPath);

      cache.routesData = [
        routeData,
        ...cache.routesData.filter(({
          component: { chunkName }
        }: $ElementType<$PropertyType<cacheType, 'routesData'>, number>) => chunkName !== routeData.component.chunkName),
      ];
      break;

    default:
      break;
  }

  writeClient(cache);
};
