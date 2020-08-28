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
const filePath = path.resolve(__dirname, './.mergeDir');

export default [
  [
    'basic usage',
    {
      ...options,
      plugins: [babelPluginMergeDir],
    },
    `// @flow`,
    [path.resolve(process.cwd(), './.mergeDir'), ''],
  ],
  [
    'ignore out of dir',
    {
      ...options,
      filename: path.resolve(__dirname, '../index.js'),
    },
    `// @flow`,
    [filePath, ''],
  ],
  [
    'should transform import module',
    {
      ...options,
      filename: path.resolve(__dirname, '../index.js'),
    },
    `// @flow

import './__ignore__/a';
import './__ignore';
import './a';`,
    [
      filePath,
      `// @flow

import './__ignore__/.mergeDir';
import './a';`,
    ],
  ],
  [
    'should transform require module',
    {
      ...options,
      filename: path.resolve(__dirname, '../index.js'),
    },
    `// @flow

require('./__ignore__/a');
require('./__ignore');
require('./a');`,
    [
      filePath,
      `// @flow

require('./__ignore/.mergeDir');
require('./a');`,
    ],
  ],
];
