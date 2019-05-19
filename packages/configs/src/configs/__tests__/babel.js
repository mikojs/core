// @flow

import babel from '../babel';

/**
 * @example
 * cssModulesTransformOptions('.less')
 *
 * @param {string} extension - file extension
 *
 * @return {Object} options of babel-plugin-css-modules-transform
 */
const cssModulesTransformOptions = (extension: string) => ({
  extensions: [extension],
  devMode: true,
  keepImport: false,
  extractCss: {
    dir: './lib',
    relativeRoot: './src',
    filename: `[path]/[name]${extension}`,
  },
});

describe('babel', () => {
  test.each`
    configsEnv   | presets                              | plugins
    ${[]}        | ${['@cat-org/base']}                 | ${[]}
    ${['react']} | ${['@cat-org/base', '@babel/react']} | ${[]}
    ${['css']}   | ${['@cat-org/base']}                 | ${[['css-modules-transform', cssModulesTransformOptions('.css')]]}
    ${['less']}  | ${['@cat-org/base']}                 | ${[['css-modules-transform', cssModulesTransformOptions('.less')]]}
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
