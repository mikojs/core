// @flow

import { declare } from '@babel/helper-plugin-utils';
import { emptyFunction } from 'fbjs';

import { mockChoice } from '@cat-org/utils';
import { type optionsType as transformFLowOptions } from '@cat-org/babel-plugin-transform-flow';

export default declare(
  (
    { assertVersion }: {| assertVersion: (version: number) => void |},
    options: {|
      '@cat-org/transform-flow'?: transformFLowOptions,
    |},
  ): {} => {
    assertVersion(7);

    return {
      presets: [
        [
          '@babel/env',
          {
            useBuiltIns: 'usage',
            corejs: '2.6.5',
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
                  ...(options['@cat-org/transform-flow']?.plugins || []),
                ],
              },
            ],
          ]),
        ),
      ],
    };
  },
);
