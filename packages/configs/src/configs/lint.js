// @flow

export default {
  alias: 'esw',
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    '@cat-org/eslint-config-cat',
    'eslint',
    'eslint-watch',
  ],
  config: () => ({
    extends: ['@cat-org/eslint-config-cat'],
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
    '!.*.js',
  ],
  run: (argv: $ReadOnlyArray<string>) => [...argv, '--cache'],
  env: {
    NODE_ENV: 'test',
  },
  configFiles: {
    babel: true,
    prettier: true,
  },
};
