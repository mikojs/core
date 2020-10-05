// @flow

import { type buildDataType } from '../../index';

const cache: {| [string]: string |} = {};

/**
 * @param {buildDataType} buildData - the data of the build function
 *
 * @return {string} - middleware cache
 */
export default ({ filePath, pathname }: buildDataType): string => {
  cache[pathname] = filePath;

  return `const requireModule = require('@mikojs/utils/lib/requireModule');

const cache = ${JSON.stringify(cache)};

module.exports = (req, res) => {
  const cacheKey = Object.keys(cache).find(key => key === req.url);

  if (!cacheKey)
    res.end();
  else
    requireModule(cache[cacheKey])(req, res);
};`;
};
