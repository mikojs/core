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
      ...(!configsEnv.includes('relay')
        ? ['@cat-org/base']
        : [
            [
              '@cat-org/base',
              {
                '@cat-org/transform-flow': {
                  ignore: /__generated__/,
                },
              },
            ],
          ]),
      ...(!configsEnv.includes('react') ? [] : ['@babel/react']),
    ],
    plugins: [
      ...(!configsEnv.some((env: string) => ['css', 'less'].includes(env))
        ? []
        : [
            [
              'css-modules-transform',
              {
                extensions: configsEnv.includes('less') ? ['.less'] : ['.css'],
                devMode: process.env.NODE_ENV !== 'production',
                keepImport: process.env.NODE_ENV !== 'test',
                extractCss: {
                  dir: './lib',
                  relativeRoot: './src',
                  filename: configsEnv.includes('less')
                    ? '[path]/[name].less'
                    : '[path]/[name].css',
                },
              },
            ],
            [
              '@cat-org/import-css',
              {
                test: configsEnv.includes('less') ? /\.less$/ : /\.css$/,
              },
            ],
          ]),
      ...(!configsEnv.includes('relay') ? [] : ['relay']),
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
