// @flow

import path from 'path';

import findCacheDir from 'find-cache-dir';

import mergeDir, { type fileDataType } from '../../index';

export type funcType = (pathname: string) => string;

const barPath = path.resolve(__dirname, './folder/bar/index.js');
const cacheDir = findCacheDir({ name: '@mikojs/merge-dir', thunk: true });
const cache = {};

/**
 * @param {string} folderPath - folder path
 * @param {string} prefix - pathname prefix
 *
 * @return {Function} - cache function
 */
export default (folderPath: string, prefix?: string): funcType =>
  mergeDir.use<[string], string>(
    folderPath,
    prefix,
    ({ filePath, pathname }: fileDataType): string => {
      cache[pathname] = path.resolve(cacheDir('main.js'), filePath);

      return `'use strict';

const invariant = require('fbjs/lib/invariant');
const requireModule = require('@mikojs/utils/lib/requireModule');

const cache = ${JSON.stringify(cache)};

module.exports = pathname => {
  const cacheKey = Object.keys(cache).find(key => key === pathname);

  if (cache['/bar'] !== '${barPath}')
    throw new Error('Could not use sub merge-dir.');

  if (cacheKey)
    return requireModule(cache[cacheKey])(pathname);
};`;
    },
  );
