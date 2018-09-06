// @flow

const eslint = {
  config: (): {} => require('./configs/eslint'),
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...argv,
    '--cache',
  ],
};

const jest = {
  config: (): {} => require('./configs/jest'),
  env: {
    NODE_ENV: 'test',
  },
};

export default {
  // babel
  babel: (): {} => require('./configs/babel'),

  // eslint
  eslint,
  esw: eslint,

  // prettier
  prettier: (): {} => require('./configs/prettier'),

  // lint-staged
  'lint-staged': (): {} => require('./configs/lintsteged'),

  // jest
  jest,
  test: {
    ...jest,
    alias: 'jest',
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...argv,
      '--silent',
    ],
  },
};
