// @flow

import { type QueryParameters as QueryParametersType } from 'query-string';

import { type fileType } from '@mikojs/server';

export type cacheType = $ReadOnlyArray<{|
  filePath: string,
  regExp: RegExp,
  getUrlQuery: (pathname: string | null) => QueryParametersType,
|}>;

const cache: {|
  [string]: {|
    filePath: string,
    pathname: string,
  |},
|} = {};

/**
 * @param {fileType} fileData - file data
 *
 * @return {string} - router cache function
 */
export default ({ exists, filePath, pathname }: fileType): string => {
  cache[pathname] = {
    filePath,
    pathname,
  };

  if (!exists) delete cache[pathname];

  return `'use strict';

const path = require('path');

const { pathToRegexp, match } = require('path-to-regexp');

const requireModule = require('@mikojs/utils/lib/requireModule');

module.exports = requireModule('@mikojs/router/lib/utils/getMiddleware')([${Object.keys(
    cache,
  )
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
    .join(', ')}])`;
};
