// @flow

import babel from '../babel';

/**
 * @example
 * cssPlugins('.less')
 *
 * @param {string} extension - file extension
 *
 * @return {plugins} css plugins
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
    '@cat-org/import-css',
    {
      test: extension === '.less' ? /\.less$/ : /\.css$/,
    },
  ],
];

const relayPresetBase = [
  [
    '@cat-org/base',
    {
      '@cat-org/transform-flow': {
        ignore: /__generated__/,
      },
    },
  ],
];

describe('babel', () => {
  test.each`
    configsEnv   | presets                              | plugins
    ${[]}        | ${['@cat-org/base']}                 | ${[]}
    ${['react']} | ${['@cat-org/base', '@babel/react']} | ${[]}
    ${['css']}   | ${['@cat-org/base']}                 | ${cssPlugins('.css')}
    ${['less']}  | ${['@cat-org/base']}                 | ${cssPlugins('.less')}
    ${['relay']} | ${relayPresetBase}                   | ${['relay']}
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
