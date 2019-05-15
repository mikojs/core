// @flow

import { emptyFunction } from 'fbjs';

import { mockChoice } from '@cat-org/utils';

export default () => ({
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
});
