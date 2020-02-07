// @flow

import buildGetPath from './utils/buildGetPath';
import buildCache from './utils/buildCache';

export type optionsType = {|
  basename?: string,
  extensions?: RegExp,
  exclude?: RegExp,
|};

/**
 * @example
 * react('/')
 *
 * @param {string} folderPath - the folder path
 * @param {optionsType} options - koa react options
 */
export default (
  folderPath: string,
  // $FlowFixMe FIXME https://github.com/facebook/flow/issues/2977
  options?: optionsType = {},
) => {
  const getPath = buildGetPath(options);

  buildCache(folderPath, options, getPath);
};
