// @flow

import path from 'path';

import { type EmptyFunctionType } from 'fbjs/lib/emptyFunction';

import mergeDir, { type fileDataType } from '../../index';

const barPath = path.resolve(__dirname, './folder/bar/index.js');
const cache = {};

/**
 * @param {string} folderPath - folder path
 * @param {string} prefix - pathname prefix
 *
 * @return {Function} - cache function
 */
export default ((folderPath: string, prefix?: string) =>
  mergeDir.get(
    mergeDir.set(
      folderPath,
      ({ filePath, pathname }: fileDataType): string => {
        cache[pathname] = filePath;

        return `'use strict';

const invariant = require('fbjs/lib/invariant');
const requireModule = require('@mikojs/utils/lib/requireModule');

const cache = ${JSON.stringify(cache)};

module.exports = pathname => {
  const cacheKey = Object.keys(cache).find(key => key === pathname);

  if (cache['/bar'] !== '${barPath}')
    throw new Error('Sub merge-dir error');

  if (cacheKey)
    return requireModule(cache[cacheKey])(pathname);
};`;
      },
      prefix,
    ),
  ): (
  folderPath: string,
  prefix?: string,
) => $PropertyType<EmptyFunctionType, 'thatReturnsArgument'>);
