// @flow

import { emptyFunction } from 'fbjs';

import { mockChoice } from '@cat-org/utils';

export default {
  install: (install: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...install,
    '@babel/cli',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-flow',
    '@babel/plugin-proposal-optional-chaining',
    '@cat-org/babel-plugin-transform-flow',
  ],
  config: (): {} => ({
    presets: [
      [
        '@babel/env',
        {
          useBuiltIns: 'usage',
        },
      ],
      '@babel/flow',
    ],
    plugins: [
      '@babel/proposal-optional-chaining',
      [
        'module-resolver',
        {
          root: ['./src'],
          cwd: 'packagejson',
        },
      ],
      ...mockChoice(
        process.env.NODE_ENV === 'test',
        emptyFunction.thatReturns([]),
        emptyFunction.thatReturns([
          [
            '@cat-org/transform-flow',
            {
              plugins: [
                [
                  'module-resolver',
                  {
                    root: ['./src'],
                    cwd: 'packagejson',
                  },
                ],
                // FIXME: remove when flow support optional-chaining
                '@babel/proposal-optional-chaining',
              ],
            },
          ],
        ]),
      ),
    ],
    ignore: mockChoice(
      process.env.NODE_ENV === 'test',
      emptyFunction.thatReturns([]),
      emptyFunction.thatReturns(['**/__tests__/**', '**/__mocks__/**']),
    ),
    overrides: [],
  }),
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...argv,
    'src',
    '-d',
    'lib',
    '--verbose',
  ],
};
