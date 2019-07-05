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
            ...(!configsEnv.includes('relay') ? [] : ['relayHash']),
          ],
        },
      },
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
