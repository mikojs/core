// @flow

import { declare } from '@babel/helper-plugin-utils';

import { mockChoice } from '@mikojs/utils';
import { type optionsType as transformFLowOptions } from '@mikojs/babel-plugin-transform-flow';

export default (declare(
  (
    { assertVersion }: {| assertVersion: (version: number) => void |},
    options: {|
      '@mikojs/transform-flow'?: transformFLowOptions,
    |},
  ): {} => {
    assertVersion(7);

    return {
      presets: [
        [
          '@babel/env',
          {
            useBuiltIns: 'usage',
            corejs: 3,
          },
        ],
        '@babel/flow',
      ],
      plugins: [
        '@babel/proposal-optional-chaining',
        '@babel/proposal-nullish-coalescing-operator',
        [
          '@babel/transform-runtime',
          {
            corejs: false,
            helpers: false,
            regenerator: true,
            useESModules: false,
          },
        ],
        [
          'module-resolver',
          {
            root: ['./src'],
            cwd: 'packagejson',
          },
        ],
        ...mockChoice(
          process.env.NODE_ENV === 'test',
          [],
          [
            [
              '@mikojs/transform-flow',
              {
                ...options['@mikojs/transform-flow'],
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
                  ...(options['@mikojs/transform-flow']?.plugins || []),
                ],
              },
            ],
          ],
        ),
      ],
    };
  },
): $Call<typeof declare>);
