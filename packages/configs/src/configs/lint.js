// @flow

export default {
  alias: 'esw',
  install: (install: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...install,
    '@cat-org/eslint-config-cat',
    'babel-eslint',
    'eslint',
    'eslint-watch',
    'eslint-config-fbjs',
    'eslint-config-google',
    'eslint-config-prettier',
    'eslint-import-resolver-babel-module',
    'eslint-plugin-babel',
    'eslint-plugin-flowtype',
    'eslint-plugin-import',
    'eslint-plugin-jsdoc',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-prettier',
    'eslint-plugin-react',
    'eslint-plugin-relay',
  ],
  config: (): {} => ({
    extends: ['@cat-org/eslint-config-cat'],
  }),
  ignore: (): $ReadOnlyArray<string> => [
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
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...argv,
    '--cache',
  ],
  env: {
    NODE_ENV: 'test',
  },
  configFiles: {
    babel: true,
    prettier: true,
  },
};
