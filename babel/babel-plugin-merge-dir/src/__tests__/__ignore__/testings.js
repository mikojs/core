// @flow

import path from 'path';

import babelPluginMergeDir from '../../index';

const options = {
  filename: path.resolve(__dirname, './index.js'),
  plugins: [babelPluginMergeDir],
  babelrc: false,
  configFile: false,
};

export default [
  [
    'basic usage',
    options,
    `// @flow`,
    [path.resolve(path.resolve(), './.mergeDir'), ''],
  ],
];
