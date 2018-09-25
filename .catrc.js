// @flow

const path = require('path');

const areEqual = require('fbjs/lib/areEqual');
const invariant = require('fbjs/lib/invariant');

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

const babel = config => {
  invariant(
    areEqual(
      {
        ...config,
        plugins: config.plugins.filter(plugin => !/^@cat-org/.test(plugin)),
      },
      defaultBabelConfig,
    ),
    'babel config should be equal to default config',
  );

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
  else {
    config.overrides[0].plugins.push([
      'module-resolver',
      {
        root: ['./src', './packages/configs/src'],
      },
    ]);
    config.overrides.push({
      test: './__mocks__',
      plugins: ['@babel/proposal-class-properties'],
    });
  }

  return config;
};

const lint = {
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
  ignore: ignore => [
    ...ignore,
    // ignore for @cat-org/eslint-config-cat
    'packages/eslint-config-cat/src/__tests__/__ignore__',
  ],
  configFiles: {
    babel: false,
    'babel:lerna': true,
  },
};

const jest = {
  configFiles: {
    babel: false,
    'babel:lerna': true,
    lint: true,
  },
};

module.exports = (() => {
  const USE_DEFAULT_BABEL_CONFIG_PATTERN = /^@cat-org\/(configs|logger|babel-.*)$/;
  const { name } = require(path.resolve(process.cwd(), './package.json'));

  if (
    /babel$/.test(process.argv[1]) &&
    USE_DEFAULT_BABEL_CONFIG_PATTERN.test(name)
  )
    return babel(defaultBabelConfig);

  return {
    // babel
    'babel:lerna': babel,

    // eslint
    lint,
    'lint:watch': lint,

    // jest
    jest,
    test: jest,
  };
})();
