// @flow

import path from 'path';

import { requireModule } from '@mikojs/utils';

/**
 * @example
 * helpers('name')
 *
 * @param {string} helperName - helper name
 *
 * @return {any} - help object
 */
export default <+C>(helperName: string): C => {
  const cache = {};

  if (!cache[helperName])
    cache[helperName] = requireModule<() => C>(
      path.resolve(__dirname, helperName),
    )();

  return cache[helperName];
};
