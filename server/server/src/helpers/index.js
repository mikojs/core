// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import { requireModule, mockChoice } from '@mikojs/utils';

/**
 * @example
 * helpers()
 *
 * @return {Function} - help function
 */
export default (): (<C>(helperName: string) => C) => {
  const cache = {};

  return <+C>(helperName: string): C => {
    if (!cache[helperName]) {
      const helper = requireModule<() => C & { run: () => void }>(
        path.resolve(
          __dirname,
          `build${helperName[0].toUpperCase()}${helperName.slice(1)}`,
        ),
      )();

      cache[helperName] = {
        ...helper,
        run: mockChoice(
          process.env.NODE_ENV === 'test',
          emptyFunction,
          helper.run,
        ),
      };
    }

    return cache[helperName];
  };
};
