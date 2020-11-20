// @flow

import server from '@mikojs/server';

import buildCache, { type cacheType } from './utils/buildCache';

export type schemaType = cacheType;

/**
 * @param {string} folderPath - folder path
 * @param {Function} callback - callback function for graphql schema
 *
 * @return {any} - result of the callback function
 */
export default <C>(folderPath: string, callback: (cache: cacheType) => C): C =>
  server.mergeDir(folderPath, undefined, buildCache)(callback);
