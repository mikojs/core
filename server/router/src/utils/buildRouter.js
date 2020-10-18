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

const url = require('url');
const path = require('path');

const { pathToRegexp, match } = require('path-to-regexp');
const { parse } = require('query-string');

const requireModule = require('@mikojs/utils/lib/requireModule');

const cache = [${Object.keys(cache)
    .sort((a: string, b: string): number => {
      const pathnameALength = [...cache[a].pathname.matchAll(/\//g)].length;
      const pathnameBLength = [...cache[b].pathname.matchAll(/\//g)].length;

      if (pathnameALength !== pathnameBLength)
        return pathnameALength > pathnameBLength ? -1 : 1;

      return !/\/:([^[\]]*)/.test(cache[a].pathname) ? -1 : 1;
    })
    .map(
      (key: string) => `{
  filePath: path.resolve(__filename, '${cache[key].filePath}'),
  regExp: pathToRegexp('${cache[key].pathname}', []),
  getUrlQuery: pathname => match('${cache[key].pathname}', { decode: decodeURIComponent })(
    pathname,
  ).params,
}`,
    )
    .join(', ')}];

module.exports = (req, res) => {
  const { pathname, query } = url.parse(req.url);
  const router = cache.find(({ regExp }) => regExp.exec(pathname));

  if (!router) {
    res.end();
    return;
  }

  const { filePath, getUrlQuery } = router;

  req.query = {
    ...parse(query || ''),
    ...getUrlQuery(pathname),
  };
  requireModule(filePath)(req, res);
};`;
};
