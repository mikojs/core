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
  config: ({ configsEnv }: { configsEnv: $ReadOnlyArray<string> }) => ({
    presets: [
      '@cat-org/base',
      ...(!configsEnv.includes('react') ? [] : ['@babel/react']),
    ],
    plugins: [
      ...(!configsEnv.includes('less')
        ? []
        : [
            [
              'css-modules-transform',
              {
                extensions: ['.less'],
                devMode: process.env.NODE_ENV !== 'production',
                keepImport: process.env.NODE_ENV !== 'test',
                extractCss: {
                  dir: './lib',
                  relativeRoot: './src',
                  filename: '[path]/[name].less',
                },
              },
            ],
          ]),
    ],
    ignore: mockChoice(
      process.env.NODE_ENV === 'test',
      emptyFunction.thatReturns([]),
      emptyFunction.thatReturns(['**/__tests__/**', '**/__mocks__/**']),
    ),
  }),
  run: (argv: $ReadOnlyArray<string>) => [
    ...argv,
    'src',
    '-d',
    'lib',
    '--verbose',
  ],
};
