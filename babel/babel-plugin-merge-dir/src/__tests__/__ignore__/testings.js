// @flow

import path from 'path';

import babelPluginMergeDir from '../../index';

export const callback: JestMockFn<
  [$ReadOnlyArray<string>],
  string,
> = jest.fn().mockImplementation(
  (filenames: $ReadOnlyArray<string>) => `module.exports = {
${filenames
  .map((filename: string, index: number) => `  m${index}: ${filename},`)
  .join('\n')}
};`,
);

const options = {
  filename: path.resolve(__dirname, './index.js'),
  plugins: [
    [
      babelPluginMergeDir,
      {
        dir: __dirname,
        extensions: /\.js$/,
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
    '// @flow',
    '// @flow',
    // for loading plugin
    [path.resolve(process.cwd(), './.mergeDir'), ''],
  ],
  [
    'ignore out of dir',
    {
      ...options,
      filename: path.resolve(__dirname, '../index.js'),
    },
    '// @flow',
    '// @flow',
    // for loading plugin
    [
      path.resolve(__dirname, './.mergeDir'),
      `module.exports = {
${['a.js', 'b/a.js', 'b/index.js', 'index.js', 'testings.js']
  .map(
    (filename: string, index: number) =>
      `  m${index}: ${path.resolve(__dirname, filename)},`,
  )
  .join('\n')}
};`,
    ],
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
import './a';

import mergeDir from './__ignore__';

mergeDir();`,
    `// @flow
import "__ignore__/.mergeDir";
import './a';
import mergeDir from "__ignore__/.mergeDir";
mergeDir();`,
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
require('./a');

const mergeDir = require('./__ignore__');

mergeDir();`,
    `// @flow
require("__ignore__/.mergeDir");

require('./a');

const mergeDir = require("__ignore__/.mergeDir");

mergeDir();`,
    null,
  ],
];
