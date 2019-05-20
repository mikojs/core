// @flow

import path from 'path';

import babelPluginTransformFlow from '../../index';

const options = {
  filename: './src/filename.js',
  plugins: [babelPluginTransformFlow],
  babelrc: false,
  configFile: false,
};

export default [
  // baseic usage
  [
    'basic usage',
    options,
    `// @flow`,
    path.resolve('./lib/filename.js.flow'),
    `// @flow`,
    'src/filename.js -> lib/filename.js.flow',
  ],
  // verbose = false
  [
    'verbose = false',
    {
      ...options,
      plugins: [
        [
          babelPluginTransformFlow,
          {
            verbose: false,
          },
        ],
      ],
    },
    `// @flow`,
    path.resolve('./lib/filename.js.flow'),
    `// @flow`,
    false,
  ],
  // use with plugins
  [
    'use with plugins',
    {
      ...options,
      plugins: [
        [
          babelPluginTransformFlow,
          {
            plugins: [
              ['@babel/proposal-pipeline-operator', { proposal: 'minimal' }],
            ],
          },
        ],
        ['@babel/proposal-pipeline-operator', { proposal: 'minimal' }],
      ],
    },
    `/**
 * fixme-flow-file-annotation
 */
'test'
  |> a
  |> b`,
    path.resolve('./lib/filename.js.flow'),
    `var _ref, _test;

/**
 * @flow
 */
_ref = (_test = 'test', a(_test)), b(_ref);`,
    'src/filename.js -> lib/filename.js.flow',
  ],
  // .flow file exist
  [
    '.flow file exist',
    {
      ...options,
      filename: path.resolve(__dirname, './flow.js'),
    },
    `// @flow`,
    path.resolve(__dirname, './flow.js.flow'),
    `// @flow
export type flowType = string;
`,
    `${path.relative(
      process.cwd(),
      path.resolve(__dirname, './flow.js'),
    )} -> ${path.relative(
      process.cwd(),
      path.resolve(__dirname, './flow.js.flow'),
    )}`,
  ],
];
