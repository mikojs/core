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
        cwd: 'packagejson',
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
    [
      '@babel/proposal-class-properties',
      {
        loose: true,
      },
    ],
    [
      '@babel/transform-runtime',
      {
        corejs: false,
        helpers: false,
        regenerator: true,
        useESModules: false,
      },
    ],
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
        validator: {
          transform: 'validator/lib/${member}',
        },
      },
    ],
  );

  config.overrides.push(
    {
      test: './packages/configs',
      plugins: [['@babel/proposal-pipeline-operator', { proposal: 'minimal' }]],
    },
    {
      test: './server/react-middleware',
      presets: ['@babel/preset-react'],
    },
    {
      test: './server/server',
      plugins: [['@babel/proposal-pipeline-operator', { proposal: 'minimal' }]],
    },
  );

  if (process.env.NODE_ENV !== 'test' && !process.env.USE_DEFAULT_BABEL)
    config.plugins
      .find(plugin => plugin[0] === '@cat-org/transform-flow')[1]
      .plugins.push(
        // FIXME: remove after flow support
        ['@babel/proposal-pipeline-operator', { proposal: 'minimal' }],
      );

  return config;
};

const lint = {
  config: config => ({
    ...config,
    globals: {
      __CAT_DATA__: true,
    },
    overrides: [
      {
        files: ['checkFilesInPackages.js'],
        settings: {
          /** In packages/** modules */
          'import/core-modules': ['@cat-org/utils'],
        },
      },
    ],
  }),
  ignore: ignore => [
    ...ignore,
    // ignore for @cat-org/eslint-config-cat testing
    'packages/eslint-config-cat/src/__tests__/__ignore__',
    // ignore for @cat-org/create-project testing
    'packages/create-project/src/__tests__/__ignore__/**/src/pages/**',
  ],
  configFiles: {
    babel: false,
    'babel:lerna': true,
  },
};

const jest = {
  config: ({ collectCoverageFrom, ...config }) => ({
    ...config,
    collectCoverageFrom: [...collectCoverageFrom, '!**/packages/jest/**'],
  }),
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
    'jest:react': jest,
    'test:react': jest,
  };
})();
