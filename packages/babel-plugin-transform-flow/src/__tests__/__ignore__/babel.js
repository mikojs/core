// @flow

import path from 'path';

import { transformFileSync } from '@babel/core';

import babelPluginTransformFlow from '../..';

const babelConfigs = {
  babelrc: false,
  presets: ['@babel/preset-env', '@babel/preset-flow'],
  plugins: [babelPluginTransformFlow],
};

export default (filename?: string = 'index.js'): string =>
  transformFileSync(path.resolve(__dirname, './files', filename), babelConfigs);
