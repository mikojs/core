// @flow

import path from 'path';

import { transformSync } from '@babel/core';

import babelPluginMergeDir from '../index';

test('babel-plugin-merge-dir', () => {
  expect(
    transformSync('', {
      filename: path.resolve(__dirname, './src/filename.js'),
      presets: ['@babel/env'],
      plugins: [babelPluginMergeDir],
      babelrc: false,
      configFile: false,
    }).code,
  ).toMatch('');
});
