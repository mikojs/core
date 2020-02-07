// @flow

import debug from 'debug';

import { type optionsType } from '../index';

const debugLog = debug('react:build-get-path');

/**
 * @example
 * buildGetPath(options)
 *
 * @param {optionsType} options - koa react options
 *
 * @return {Function} - get path function
 */
export default ({ basename }: optionsType) => (
  relativePath: string,
): string => {
  const routePath = relativePath
    .replace(/(\/?index)?$/, '')
    .replace(/^/, '/')
    .replace(/\/\[([^[\]]*)\]/g, '/:$1');

  debugLog({
    relativePath,
    routePath,
  });

  return `${basename || ''}${routePath}`;
};
