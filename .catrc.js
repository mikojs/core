// @flow

/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable jsdoc/require-jsdoc */

const babel = config => {
  if (!config.plugins) config.plugins = [];

  if (!config.overrides) config.overrides = [];

  config.plugins.push('add-module-exports', [
    'transform-imports',
    {
      '@mikojs/utils': {
        transform: '@mikojs/utils/lib/${member}',
      },
      fbjs: {
        transform: 'fbjs/lib/${member}',
      },
      validator: {
        transform: 'validator/lib/${member}',
      },
    },
  ]);

  return config;
};

const lint = {
  config: config => ({
    ...config,
    globals: {
      __MIKOJS_DATA__: true,
    },
    overrides: [
      {
        files: ['__mocks__/**'],
        rules: {
          'import/no-extraneous-dependencies': 'off',
        },
      },
    ],
  }),
  ignore: ignore => ({
    ...ignore,
    ignore: [
      ...ignore.ignore,
      // ignore for @mikojs/eslint-config-base testing
      'packages/eslint-config-base/src/__tests__/__ignore__',
    ],
  }),
};

const jest = {
  config: ({ collectCoverageFrom, ...config }) => ({
    ...config,
    collectCoverageFrom: [...collectCoverageFrom, '!**/packages/jest/**'],
  }),
  configsFiles: {
    lint: true,
  },
};

module.exports = (() => {
  if (/babel$/.test(process.argv[1]) && process.env.USE_DEFAULT_BABEL)
    return babel({
      presets: [
        [
          '@babel/env',
          {
            useBuiltIns: 'usage',
            corejs: 3,
          },
        ],
        '@babel/flow',
      ],
      plugins: [
        '@babel/proposal-optional-chaining',
        '@babel/proposal-nullish-coalescing-operator',
        [
          '@babel/transform-runtime',
          {
            corejs: false,
            helpers: false,
            regenerator: true,
            useESModules: false,
          },
        ],
        [
          'module-resolver',
          {
            root: ['./src'],
            cwd: 'packagejson',
          },
        ],
        [
          '@babel/proposal-class-properties',
          {
            loose: true,
          },
        ],
        ['@babel/proposal-pipeline-operator', { proposal: 'minimal' }],
      ],
      ignore:
        process.env.NODE_ENV === 'test'
          ? []
          : ['**/__tests__/**', '**/__mocks__/**'],
    });

  /* eslint-disable import/no-extraneous-dependencies */
  const withRelay = require('@mikojs/configs/lib/withRelay');
  const withServer = require('@mikojs/configs/lib/withServer');
  const withLess = require('@mikojs/configs/lib/withLess');
  /* eslint-enable import/no-extraneous-dependencies */

  return [
    withRelay,
    withServer,
    withLess,
    {
      configsEnv: ['server', 'react', 'relay', 'less'],

      // babel
      babel,
      'babel:lerna': babel,

      // eslint
      lint,
      'lint:watch': lint,

      // jest
      jest,
      test: jest,
    },
  ];
})();
