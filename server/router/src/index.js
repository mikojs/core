// @flow

import mergeDir, { type fileDataType } from '@mikojs/merge-dir';
import { type middlewareType } from '@mikojs/server';

type cacheType = {|
  [string]: {|
    filePath: string,
    pathname: string,
  |},
|};

const cache: cacheType = {};

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
      cache[pathname] = {
        filePath,
        pathname,
      };

      if (!exists) delete cache[pathname];

      return `'use strict';

const { pathToRegexp, match } = require('path-to-regexp');
const { parse } = require('query-string');

const requireModule = require('@mikojs/utils/lib/requireModule');

const cache = {${Object.keys(cache)
        .map(
          (key: string) => `{
  filePath: '${cache[key].filePath}',
  regExp: pathToRegexp('${cache[key].pathname}', []),
  getUrlQuery: pathname => match('${cache[key].pathname}', { decode: decodeURIComponent })(
    pathname,
  ).params,
}`,
        )
        .join(', ')}};

module.exports = (req, res) => {
  const cacheKey = Object.keys(cache).find(key => cache[key].regExp.exec(req.url));

  if (!cacheKey) {
    res.end();
    return;
  }

  const { filePath, getUrlQuery } = cache[cacheKey];

  req.query = {
    ...parse(query || ''),
    ...getUrlQuery(pathname),
  };
  requireModule(filePath)(req, res);
};`;
    },
  );
