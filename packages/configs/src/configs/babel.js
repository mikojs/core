// @flow

import { emptyFunction } from 'fbjs';

import { mockChoice } from '@cat-org/utils';

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    '@babel/cli',
    '@babel/core',
    '@cat-org/babel-plugin-base',
  ],
  config: () => ({
    presets: ['@cat-org/babel-plugin-base'],
    ignore: mockChoice(
      process.env.NODE_ENV === 'test',
      emptyFunction.thatReturns([]),
      emptyFunction.thatReturns(['**/__tests__/**', '**/__mocks__/**']),
    ),
    overrides: [],
  }),
  run: (argv: $ReadOnlyArray<string>) => [
    ...argv,
    'src',
    '-d',
    'lib',
    '--verbose',
  ],
};
