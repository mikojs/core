// @flow

export default {
  alias: 'esw',
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    '@mikojs/eslint-config-base',
    'eslint',
    'eslint-watch',
  ],
  config: ({ configsEnv }: { configsEnv: $ReadOnlyArray<string> }) => ({
    extends: '@mikojs/base',
    rules: {
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: [
            'flow',
            'jest-environment',
            ...(!configsEnv.includes('react') ? [] : ['react']),
            ...(!configsEnv.includes('relay') ? [] : ['relayHash']),
          ],
        },
      ],
      ...(!configsEnv.includes('react')
        ? {}
        : {
            'jsdoc/require-example': ['error', { exemptedBy: ['react'] }],
            'jsdoc/require-param': ['error', { exemptedBy: ['react'] }],
            'jsdoc/require-returns': ['error', { exemptedBy: ['react'] }],
          }),
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
      'flow-typed/npm',

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
