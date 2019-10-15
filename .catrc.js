// @flow

/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable jsdoc/require-jsdoc */

const babel = config => {
  if (!config.plugins) config.plugins = [];

  if (!config.overrides) config.overrides = [];

  config.plugins.push(
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
    ],
  );

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
        files: [
          'packages/create-project/src/__tests__/__ignore__/lerna/**',
          'packages/create-project/src/__tests__/__ignore__/lerna/**/.templates/**',
          '__mocks__/**',
        ],
        rules: {
          'import/no-extraneous-dependencies': 'off',
        },
      },
    ],
  }),
  ignore: ignore => [
    ...ignore,
    // ignore for @mikojs/eslint-config-base testing
    'packages/eslint-config-base/src/__tests__/__ignore__',
  ],
};

const jest = {
  config: ({ collectCoverageFrom, ...config }) => ({
    ...config,
    collectCoverageFrom: [...collectCoverageFrom, '!**/packages/jest/**'],
    forceCoverageMatch: [
      '**/packages/create-project/src/__tests__/__ignore__/**/*.js',
    ],
  }),
  configFiles: {
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
            corejs: '2.6.5',
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

  return {
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
  };
})();
