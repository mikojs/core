// @flow

import { type dataType } from '../../index';

const cache = {};

/**
 * @param {dataType} data - the data of the build function
 *
 * @return {string} - middleware cache
 */
export default ({ filePath, pathname }: dataType): string => {
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
