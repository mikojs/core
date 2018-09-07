// @flow

const path = require('path');

/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable require-jsdoc */

const defaultBabelConfig = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
      },
    ],
    '@babel/flow',
  ],
  plugins: [
    '@babel/proposal-optional-chaining',
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

const babel = {
  config: config => {
    // TODO check config is same
    config.plugins.push('@babel/proposal-class-properties', [
      'transform-imports',
      {
        '@cat-org/utils': {
          transform: '@cat-org/utils/lib/${member}',
        },
        fbjs: {
          transform: 'fbjs/lib/${member}',
        },
      },
    ]);

    config.overrides.push({
      test: './packages',
      plugins: process.env.NODE_ENV === 'test' ? [] : ['add-module-exports'],
    });

    return config;
  },
};

const lint = {
  run: argv => [
    ...argv,
    '--ignore-pattern',
    'packages/eslint-config-cat/src/__tests__/__ignore__',
  ],
  config: config => ({
    ...config,
    overrides: [
      {
        files: [
          'checkBabelConfig.js',
          'checkFilesInPackages.js',
          '.catrc.js',
          'babel.config.js',
        ],
        settings: {
          /** In packages/** modules */
          'import/core-modules': ['@cat-org/configs', '@cat-org/utils'],
        },
      },
    ],
  }),
};

module.exports = (() => {
  const USE_DEFAULT_BABEL_CONFIG_PATTERN = /^@cat-org\/(configs|babel-.*)$/;
  const { name } = require(path.resolve(process.cwd(), './package.json'));

  if (
    (/babel$/.test(process.argv[1]) && !process.env.USE_CONFIGS_SCRIPTS) ||
    USE_DEFAULT_BABEL_CONFIG_PATTERN.test(name)
  )
    return babel.config(defaultBabelConfig);

  return require('@cat-org/configs')({
    // babel
    babel,

    // lint
    lint,
    'lint:watch': lint,
  });
})();
