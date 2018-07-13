// @flow
const path = require('path');

/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
const babelConfigs = (() => {
  const USE_DEFAULT_BABEL_CONFIG_PATTERN = /^@cat-org\/(configs|babel-.*)$/;
  const { name } = require(path.resolve(process.cwd(), './package.json'));

  if (
    process.env.NODE_ENV === 'test' ||
    USE_DEFAULT_BABEL_CONFIG_PATTERN.test(name)
  )
    return {
      presets: ['@babel/preset-env', '@babel/preset-flow'],
      plugins: ['@babel/plugin-proposal-optional-chaining'],
      ignore: process.env.NODE_ENV === 'test' ? [] : ['**/__tests__/**'],
      overrides: [],
    };

  const configs = (requireConfigs => requireConfigs.default || requireConfigs)(
    require('./packages/configs/lib/babel'),
  );

  configs.plugins = configs.plugins.map(
    plugin =>
      /^@cat-org/.test(plugin)
        ? require(plugin.replace(
            /@cat-org\/(.*)/,
            './packages/$1/lib/index.js',
          ))
        : plugin,
  );

  return configs;
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
