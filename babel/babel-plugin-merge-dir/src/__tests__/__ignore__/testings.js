// @flow

import path from 'path';

import babelPluginMergeDir from '../../index';

export const callback = jest.fn();

const options = {
  filename: path.resolve(__dirname, './index.js'),
  plugins: [
    [
      babelPluginMergeDir,
      {
        dir: __dirname,
        callback,
      },
    ],
  ],
  babelrc: false,
  configFile: false,
};

export default [
  [
    'basic usage',
    {
      ...options,
      plugins: [babelPluginMergeDir],
    },
    `// @flow`,
    // for load plugin
    [path.resolve(process.cwd(), './.mergeDir'), ''],
  ],
  [
    'ignore out of dir',
    {
      ...options,
      filename: path.resolve(__dirname, '../index.js'),
    },
    `// @flow`,
    // for load plugin
    [path.resolve(__dirname, './.mergeDir'), ''],
  ],
  [
    'should transform import module',
    {
      ...options,
      filename: path.resolve(__dirname, '../index.js'),
    },
    `// @flow

import './__ignore__/a';
import './__ignore__';
import './a';`,
    null,
  ],
  [
    'should transform require module',
    {
      ...options,
      filename: path.resolve(__dirname, '../index.js'),
    },
    `// @flow

require('./__ignore__/a');
require('./__ignore__');
require('./a');`,
    null,
  ],
];
