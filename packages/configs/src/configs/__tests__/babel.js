// @flow

import babel from '../babel';

const reactPlugins = [
  [
    '@babel/proposal-class-properties',
    {
      loose: true,
    },
  ],
];

/**
 * @example
 * cssPlugins('.less')
 *
 * @param {string} extension - file extension
 *
 * @return {Array} css plugins
 */
const cssPlugins = (extension: string) => [
  [
    'css-modules-transform',
    {
      extensions: [extension],
      devMode: true,
      keepImport: false,
      extractCss: {
        dir: './lib',
        relativeRoot: './src',
        filename: `[path]/[name]${extension}`,
      },
    },
  ],
  [
    '@mikojs/import-css',
    {
      test: extension === '.less' ? /\.less$/ : /\.css$/,
    },
  ],
];

const relayPresetBase = [
  [
    '@mikojs/base',
    {
      '@mikojs/transform-flow': {
        ignore: /__generated__/,
      },
    },
  ],
];

const serverPresetBase = [
  [
    '@mikojs/base',
    {
      '@mikojs/transform-flow': {
        plugins: [
          ['@babel/proposal-pipeline-operator', { proposal: 'minimal' }],
        ],
      },
    },
  ],
];

const serverPlugins = [
  ['@babel/proposal-pipeline-operator', { proposal: 'minimal' }],
];

describe('babel', () => {
  test.each`
    configsEnv    | presets                             | plugins
    ${[]}         | ${['@mikojs/base']}                 | ${[]}
    ${['react']}  | ${['@mikojs/base', '@babel/react']} | ${reactPlugins}
    ${['css']}    | ${['@mikojs/base']}                 | ${cssPlugins('.css')}
    ${['less']}   | ${['@mikojs/base']}                 | ${cssPlugins('.less')}
    ${['relay']}  | ${relayPresetBase}                  | ${['relay']}
    ${['server']} | ${serverPresetBase}                 | ${serverPlugins}
  `(
    'run with configsEnv = $configsEnv',
    ({
      configsEnv,
      presets,
      plugins,
    }: {|
      configsEnv: $ReadOnlyArray<string>,
      presets: $ReadOnlyArray<string>,
      plugins: $ReadOnlyArray<[string, {}]>,
    |}) => {
      expect(babel.config({ configsEnv }).presets).toEqual(presets);
      expect(babel.config({ configsEnv }).plugins).toEqual(plugins);
    },
  );
});
