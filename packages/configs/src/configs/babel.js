// @flow

import { emptyFunction } from 'fbjs';

import { mockChoice } from '@mikojs/utils';

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    '@babel/cli',
    '@babel/core',
    '@mikojs/babel-preset-base',
  ],
  config: () => ({
    presets: ['@mikojs/base'],
    ignore: mockChoice(
      process.env.NODE_ENV === 'test',
      emptyFunction.thatReturns([]),
      emptyFunction.thatReturns(['**/__tests__/**', '**/__mocks__/**']),
    )(),
  }),
  run: (argv: $ReadOnlyArray<string>) => [
    ...argv,
    'src',
    '-d',
    'lib',
    '--verbose',
  ],
  configsFiles: {
    babel: 'babel.config.js',
  },
};
