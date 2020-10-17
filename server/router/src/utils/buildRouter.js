// @flow

import { type fileDataType } from '@mikojs/merge-dir';

type cacheType = {|
  [string]: {|
    filePath: string,
    pathname: string,
  |},
|};

const cache: cacheType = {};

/**
 * @param {fileDataType} fileData - file data
 *
 * @return {string} - router cache function
 */
export default ({ exists, filePath, pathname }: fileDataType): string => {
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
};
