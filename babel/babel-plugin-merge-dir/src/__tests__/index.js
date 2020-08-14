// @flow

import path from 'path';

import { transformFileSync, transformSync } from '@babel/core';

import babelPluginMergeDir from '../index';

const options = {
  presets: ['@babel/env'],
  plugins: [
    [babelPluginMergeDir, { dir: path.resolve(__dirname, './__ignore__') }],
  ],
  babelrc: false,
  configFile: false,
};

describe('babel-plugin-merge-dir', () => {
  test('can generate cache', () => {
    expect(
      transformFileSync(
        path.resolve(__dirname, './__ignore__/index.js'),
        options,
      ).code,
    ).toBe(`// @flow
"use strict";`);
  });

  test('can import merged dir and remove the all relative path', () => {
    expect(
      transformSync(`import './__ignore__';`, {
        ...options,
        filename: path.resolve(__dirname, './index.js'),
      }).code,
    ).toBe(`"use strict";
require("./__ignore__/.mergeDir");`);
  });
});
