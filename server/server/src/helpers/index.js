// @flow

import path from 'path';

import { requireModule } from '@mikojs/utils';

/**
 * @example
 * helpers()
 *
 * @return {Function} - help function
 */
export default (): (<C>(helperName: string) => C) => {
  const cache = {};

  return <+C>(helperName: string): C => {
    if (!cache[helperName])
      cache[helperName] = requireModule<() => C & { run: () => void }>(
        path.resolve(
          __dirname,
          `build${helperName[0].toUpperCase()}${helperName.slice(1)}`,
        ),
      )();

    return cache[helperName];
  };
};
