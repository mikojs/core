// @flow

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

  config.plugins.push(
    '@babel/proposal-export-default-from',
    '@babel/proposal-class-properties',
    'add-module-exports',
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
  );

  config.overrides.push({
    test: './packages/configs',
    plugins: [['@babel/proposal-pipeline-operator', { proposal: 'minimal' }]],
  });

  if (process.env.NODE_ENV === 'test')
    config.overrides[0].plugins.push([
      'module-resolver',
      {
        root: ['./src', './packages/configs/src'],
      },
    ]);
  else if (!process.env.USE_DEFAULT_BABEL)
    config.plugins
      .find(plugin => plugin[0] === '@cat-org/transform-flow')[1]
      .config.plugins.push(
        // FIXME: remove after flow support
        '@babel/proposal-export-default-from',
        ['@babel/proposal-pipeline-operator', { proposal: 'minimal' }],
      );

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
  if (/babel$/.test(process.argv[1]) && process.env.USE_DEFAULT_BABEL)
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
