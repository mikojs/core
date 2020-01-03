// @flow

import { emptyFunction } from 'fbjs';

import { mockChoice } from '@mikojs/utils';

type transformFlowOptionType = {
  ignore: ?RegExp,
};

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    '@babel/cli',
    '@babel/core',
    '@mikojs/babel-preset-base',
  ],
  config: ({ configsEnv }: { configsEnv: $ReadOnlyArray<string> }) => ({
    presets: [
      ...(!configsEnv.some((env: string) => ['relay', 'server'].includes(env))
        ? ['@mikojs/base']
        : [
            [
              '@mikojs/base',
              {
                '@mikojs/transform-flow': {
                  // FIXME: https://github.com/facebook/flow/issues/2977
                  ...((!configsEnv.includes('relay')
                    ? {}
                    : {
                        ignore: /__generated__/,
                      }): transformFlowOptionType),
                  ...(!configsEnv.includes('server')
                    ? {}
                    : {
                        plugins: [
                          [
                            '@babel/proposal-pipeline-operator',
                            { proposal: 'minimal' },
                          ],
                        ],
                      }),
                },
              },
            ],
          ]),
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
              '@mikojs/import-css',
              {
                test: configsEnv.includes('less') ? /\.less$/ : /\.css$/,
              },
            ],
          ]),
      ...(!configsEnv.includes('relay') ? [] : ['relay']),
      ...(!configsEnv.includes('server')
        ? []
        : [['@babel/proposal-pipeline-operator', { proposal: 'minimal' }]]),
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
  configsFiles: {
    babel: 'babel.config.js',
  },
};
