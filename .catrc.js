// @flow

/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable require-jsdoc */

const babel = config => {
  if (!config.plugins) config.plugins = [];

  if (!config.overrides) config.overrides = [];

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

  config.overrides.push({
    test: ['./packages/configs', './server/server', './server/use-less'],
    presets:
      process.env.NODE_ENV === 'test' || process.env.USE_DEFAULT_BABEL
        ? []
        : [
            [
              '@cat-org/base',
              {
                '@cat-org/transform-flow': {
                  plugins: [
                    // FIXME: remove after flow support
                    [
                      '@babel/proposal-pipeline-operator',
                      { proposal: 'minimal' },
                    ],
                  ],
                },
              },
            ],
          ],
    plugins: [['@babel/proposal-pipeline-operator', { proposal: 'minimal' }]],
  });

  return config;
};

const lint = {
  config: config => ({
    ...config,
    globals: {
      __CAT_DATA__: true,
    },
  }),
  ignore: ignore => [
    ...ignore,
    // ignore for @cat-org/eslint-config-cat testing
    'packages/eslint-config-cat/src/__tests__/__ignore__',
    // ignore for @cat-org/create-project testing
    'packages/create-project/src/__tests__/__ignore__/**/src/pages/**',
  ],
};

const jest = {
  config: ({ collectCoverageFrom, ...config }) => ({
    ...config,
    collectCoverageFrom: [...collectCoverageFrom, '!**/packages/jest/**'],
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
      ],
      ignore:
        process.env.NODE_ENV === 'test'
          ? []
          : ['**/__tests__/**', '**/__mocks__/**'],
    });

  return {
    configsEnv: ['react', 'css', 'less'],

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
