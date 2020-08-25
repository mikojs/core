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
    'should transform import',
    {
      ...options,
      filename: path.resolve(__dirname, '../index.js'),
    },
    `// @flow

import './__ignore__/a';
import './a'`,
    [
      filePath,
      `// @flow

import './a'`,
    ],
  ],
];
