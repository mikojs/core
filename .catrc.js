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
    config.plugins.push([
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

    config.overrides.push(
      {
        test: './packages/configs',
        plugins: [
          ['@babel/proposal-pipeline-operator', { proposal: 'minimal' }],
          '@babel/proposal-class-properties',
        ],
      },
      {
        test: './packages/babel-plugin-transform-flow',
        plugins: ['@babel/proposal-class-properties'],
      },
    );

    if (process.env.NODE_ENV !== 'test')
      config.plugins.push('add-module-exports');

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
  configFiles: {
    babel: false,
    'babel:lerna': true,
  },
};

module.exports = (() => {
  const USE_DEFAULT_BABEL_CONFIG_PATTERN = /^@cat-org\/(configs|babel-.*)$/;
  const { name } = require(path.resolve(process.cwd(), './package.json'));

  if (
    /babel$/.test(process.argv[1]) &&
    USE_DEFAULT_BABEL_CONFIG_PATTERN.test(name)
  )
    return babel.config(defaultBabelConfig);

  return {
    // babel
    'babel:lerna': babel,

    // eslint
    lint,
    'lint:watch': lint,
  };
})();
