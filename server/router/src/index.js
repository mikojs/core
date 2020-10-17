// @flow

import mergeDir, { type fileDataType } from '@mikojs/merge-dir';
import { type middlewareType } from '@mikojs/server';

const cache = {};

/**
 * @param {string} folderPath - folder path
 * @param {string} prefix - pathname prefix
 *
 * @return {middlewareType} - router middleware
 */
export default (folderPath: string, prefix?: string): middlewareType =>
  mergeDir.use(
    folderPath,
    prefix,
    ({ exists, filePath, pathname }: fileDataType): string => {
      cache[pathname] = filePath;

      if (!exists) delete cache[pathname];

      return `'use strict';

const requireModule = require('@mikojs/utils/lib/requireModule');

const cache = ${JSON.stringify(cache)};

module.exports = (req, res) => {
  const cacheKey = Object.keys(cache).find(key => key === req.url);

  if (!cacheKey)
    res.end();
  else
    requireModule(cache[cacheKey])(req, res);
};`;
    },
  );
