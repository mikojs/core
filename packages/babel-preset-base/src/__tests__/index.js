// @flow

import { emptyFunction } from 'fbjs';

import babelPresetBase from '../index';

test('babel-preset-base', () => {
  expect(
    babelPresetBase(
      {
        assertVersion: emptyFunction,
      },
      {},
    ),
  ).toEqual({
    // shoud be equal to .catrc
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
    ],
  });
});
