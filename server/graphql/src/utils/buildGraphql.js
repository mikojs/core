// @flow

import { type fileDataType } from '@mikojs/server';

const cache: {|
  [string]: string,
|} = {};

/**
 * @param {fileDataType} fileData - file data
 *
 * @return {string} - graphql cache function
 */
export default ({ exists, filePath, pathname }: fileDataType): string => {
  cache[pathname] = filePath;

  if (!exists) delete cache[pathname];

  return `'use strict';

const path = require('path');

const requireModule = require('@mikojs/utils/lib/requireModule');

module.exports = require('@mikojs/graphql/lib/utils/buildMiddleware')([${Object.keys(
    cache,
  )
    .map((key: string) => `requireModule('${cache[key]}')`)
    .join(', ')}]);`;
};
