// @flow

export default {
  alias: 'esw',
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    '@mikojs/eslint-config-base',
    'eslint',
    'eslint-watch',
  ],
  config: () => ({
    extends: '@mikojs/base',
    rules: {
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['flow', 'jest-environment'],
        },
      ],
    },
  }),
  ignore: () => ({
    name: '.eslintignore',
    ignore: [
      // node
      'node_modules',

      // babel
      'lib',

      // flow
      '**/flow-typed/npm',

      // jest
      'coverage',

      // add checking other configs
      '!.*',
    ],
  }),
  run: (argv: $ReadOnlyArray<string>) => [...argv, '--cache', '--color'],
  env: {
    NODE_ENV: 'test',
  },
  configsFiles: {
    lint: '.eslintrc.js',
    babel: true,
    prettier: true,
  },
};
