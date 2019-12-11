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
  ignore: ignore => ({
    ...ignore,
    ignore: [
      ...ignore.ignore,
      // ignore for @mikojs/eslint-config-base testing
      'packages/eslint-config-base/src/__tests__/__ignore__',
      'packages/nested-flow/**/flow-typed/npm',
      'packages/create-project/**/flow-typed/npm',
    ],
  }),
};

const jest = {
  config: ({ collectCoverageFrom, ...config }) => {
    const path = require('path');

    // eslint-disable-next-line import/no-extraneous-dependencies
    const d3DirTree = require('@mikojs/utils/lib/d3DirTree');

    return {
      ...config,
      collectCoverageFrom: [...collectCoverageFrom, '!**/packages/jest/**'],
      forceCoverageMatch: d3DirTree(
        path.resolve(
          __dirname,
          './packages/create-project/src/__tests__/__ignore__',
        ),
        {
          exclude: [
            /node_modules/,
            /flow-typed\/npm/,
            /__generated__/,
            /__tests__\/__ignore__\/.*\/__tests__/,
            /__tests__\/__ignore__\/[a-zA-Z]*.js$/,
          ],
          extensions: /\.js$/,
        },
      )
        .leaves()
        .map(({ data: { path: filePath } }) => filePath),
    };
  },
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
