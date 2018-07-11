// @flow
const path = require('path');

/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
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

/**
 * @example
 * transformImportsOptions(false)
 *
 * @param {boolean} isRoot - flag for checking this is @cat-org/root
 * @return {Object} - options for "transform imports"
 */
const transformImportsOptions = isRoot => ({
  '@cat-org/utils': {
    // $FlowFixMe
    transform: (importName, matches) =>
      isRoot
        ? path.resolve(__dirname, './packages/utils/lib', importName)
        : `@cat-org/utils/lib/${importName}`,
  },
  fbjs: {
    transform: 'fbjs/lib/${member}',
  },
});

babelConfigs.plugins.push(
  ['transform-imports', transformImportsOptions(false)],
  [
    'module-resolver',
    {
      root: ['./src'],
    },
  ],
);

babelConfigs.overrides.push(
  {
    test: './src',
    plugins: [['transform-imports', transformImportsOptions(true)]],
  },
  {
    test: './src/__tests__',
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@cat-org/configs': './packages/configs',
          },
        },
      ],
    ],
  },
  {
    test: './packages',
    plugins: ['add-module-exports'],
  },
);

module.exports = babelConfigs;
