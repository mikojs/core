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
    ],
  });
});
