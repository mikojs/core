// @flow
const path = require('path');

// eslint-disable-next-line flowtype/require-return-type
const babelConfigs = (() => {
  try {
    if (process.env.NODE_ENV === 'test') throw new Error('test');

    const configs = require('./packages/configs/lib/babel');

    return configs.default || configs;
  } catch (e) {
    return {
      presets: ['@babel/preset-env', '@babel/preset-flow'],
      plugins: ['@babel/plugin-proposal-optional-chaining'],
      ignore: process.env.NODE_ENV === 'test' ? [] : ['**/__tests__/**'],
      overrides: [],
    };
  }
})();

/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-parameter-type */
// TODO
/* eslint-disable no-confusing-arrow */
/**
 * @example
 * transformImports('utils', false)
 *
 * @param {string} packageName - package name
 * @param {boolean} isRoot - flag for checking this is @cat-org/root
 * @return {Function} - function for "transform imports"
 *
 * $FlowFixMe
 */
const transformImports = (packageName, isRoot) => (importName, matches) =>
  isRoot
    ? path.resolve(__dirname, './packages', packageName, './lib', importName)
    : `@cat-org/${packageName}/lib/${importName}`;

/**
 * @example
 * transformImportsOptions(false)
 *
 * @param {boolean} isRoot - flag for checking this is @cat-org/root
 * @return {Object} - options for "transform imports"
 */
const transformImportsOptions = isRoot => ({
  '@cat-org/utils': {
    transform: transformImports('utils', isRoot),
  },
  '@cat-org/configs': {
    transform: transformImports('configs', isRoot),
  },
  fbjs: {
    transform: 'fbjs/lib/${member}',
  },
});
/* eslint-enable flowtype/require-return-type */
/* eslint-enable flowtype/require-parameter-type */
/* eslint-enable flowtype/require-parameter-type */
// TODO
/* eslint-enable no-confusing-arrow */

babelConfigs.plugins.push(
  ['transform-imports', transformImportsOptions(false)],
  [
    'module-resolver',
    {
      root: ['./src'],
    },
  ],
);

if (!babelConfigs.overrides) babelConfigs.overrides = [];

babelConfigs.overrides.push(
  {
    test: './src',
    plugins: [['transform-imports', transformImportsOptions(true)]],
  },
  {
    test: './packages',
    plugins: ['add-module-exports'],
  },
);

module.exports = babelConfigs;
