// @flow

export default {
  alias: 'esw',
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    '@cat-org/eslint-config-cat',
    'eslint',
    'eslint-watch',
  ],
  config: ({ configsEnv }: { configsEnv: $ReadOnlyArray<string> }) => ({
    extends: '@cat-org/cat',
    settings: {
      jsdoc: {
        additionalTagNames: {
          customTags: [
            'flow',
            'jest-environment',
            ...(!configsEnv.includes('react') ? [] : ['react']),
            ...(!configsEnv.includes('relay') ? [] : ['relayHash']),
          ],
        },
      },
    },
    rules: {
      ...(!configsEnv.includes('react')
        ? {}
        : {
            'jsdoc/require-example': ['error', { exemptedBy: ['react'] }],
            'jsdoc/require-param': ['error', { exemptedBy: ['react'] }],
            'jsdoc/require-returns': ['error', { exemptedBy: ['react'] }],
          }),
    },
  }),
  ignore: () => [
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
  run: (argv: $ReadOnlyArray<string>) => [...argv, '--cache', '--color'],
  env: {
    NODE_ENV: 'test',
  },
  configFiles: {
    babel: true,
    prettier: true,
  },
};
