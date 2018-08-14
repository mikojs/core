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

  return (requireConfigs => requireConfigs.default || requireConfigs)(
    require('@cat-org/configs/lib/babel'),
  );
})();

babelConfigs.plugins.push(
  [
    'transform-imports',
    {
      '@cat-org/utils': {
        transform: '@cat-org/utils/lib/${member}',
      },
      fbjs: {
        transform: 'fbjs/lib/${member}',
      },
    },
  ],
  '@babel/plugin-proposal-class-properties',
);

babelConfigs.overrides.push({
  test: './packages',
  plugins: process.env.NODE_ENV === 'test' ? [] : ['add-module-exports'],
});

module.exports = babelConfigs;
