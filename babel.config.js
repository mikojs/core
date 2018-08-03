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
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
        [
          'module-resolver',
          {
            root: ['./src'],
          },
        ],
      ],
      ignore:
        process.env.NODE_ENV === 'test'
          ? []
          : ['**/__tests__/**', '**/__mocks__/**'],
      overrides: [],
    };

  const configs = (requireConfigs => requireConfigs.default || requireConfigs)(
    require('./packages/configs/lib/babel'),
  );

  configs.plugins = configs.plugins.map(plugin => {
    const pluginName = plugin instanceof Array ? plugin[0] : plugin;

    if (!/^@cat-org/.test(pluginName)) return plugin;

    const pluginRequired = require(pluginName.replace(
      /@cat-org\/(.*)/,
      './packages/$1/lib/index.js',
    ));

    if (plugin instanceof Array) return [pluginRequired, plugin[1]];

    return pluginRequired;
  });

  return configs;
})();

/**
 * @example
 * transformImports(false)
 *
 * @param {boolean} isRoot - flag for checking this is @cat-org/root
 * @return {Array} - transform imports
 */
const transformImports = isRoot => [
  'transform-imports',
  {
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
  },
];

babelConfigs.plugins.push(transformImports(false));
babelConfigs.overrides.push(
  {
    test: './__tests__',
    plugins: [
      transformImports(true),
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
    plugins: process.env.NODE_ENV === 'test' ? [] : ['add-module-exports'],
  },
);

module.exports = babelConfigs;
