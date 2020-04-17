// @flow

/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable jsdoc/require-jsdoc */

const miko = ({ clean, ...config }) => ({
  ...config,
  clean: {
    ...clean,
    command: clean.command.replace(
      / \.flowconfig'/,
      `' && lerna exec 'rm -rf .flowconfig' --ignore ${[
        '@mikojs/miko',
        '@mikojs/configs',
        '@mikojs/eslint-config-base',
        '@mikojs/koa-react',
        '@mikojs/koa-graphql',
        '@mikojs/use-css',
        '@mikojs/use-less',
        '@mikojs/website',
      ].join(' --ignore ')}`,
    ),
  },
});

const babel = ({ plugins, ...config }) => ({
  ...config,
  plugins: [
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
  ],
});

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
  ignore: ignore => [
    ...ignore,
    // ignore for @mikojs/eslint-config-base testing
    'packages/eslint-config-base/src/__tests__/__ignore__',
  ],
};

const jest = ({ collectCoverageFrom, testPathIgnorePatterns, ...config }) => ({
  ...config,
  collectCoverageFrom: [
    ...collectCoverageFrom,
    '!**/packages/jest/**',
    '!**/packages/website/**',
  ],
  testPathIgnorePatterns: [
    ...testPathIgnorePatterns,
    '<rootDir>/packages/website/',
  ],
});

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

  return [
    /* eslint-disable import/no-extraneous-dependencies */
    require('@mikojs/configs'),
    require('@mikojs/configs/lib/withRelay'),
    require('@mikojs/configs/lib/withServer'),
    require('@mikojs/configs/lib/withLess'),
    require('@mikojs/configs/lib/withLerna'),
    /* eslint-enable import/no-extraneous-dependencies */
    {
      // miko
      miko,

      // babel
      babel,

      // eslint
      lint,

      // jest
      jest,
    },
  ];
})();
