// @flow

import path from 'path';

import { transformSync, transformFileSync } from '@babel/core';

import babelPluginTransformFlow from '../..';
import reset from './reset';

const babelConfigs = {
  cwd: __dirname,
  babelrc: false,
  presets: ['@babel/preset-env', '@babel/preset-flow'],
  plugins: [babelPluginTransformFlow],
};

export default (filename?: string) => {
  reset();

  if (filename)
    transformFileSync(
      path.resolve(__dirname, './files', filename),
      babelConfigs,
    );
  else transformSync('// no transform;', babelConfigs);
};
