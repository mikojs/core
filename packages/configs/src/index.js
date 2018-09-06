// @flow

const lint = {
  alias: 'esw',
  config: (): {} => require('./configs/eslint'),
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...argv,
    '--cache',
  ],
  env: {
    NODE_ENV: 'test',
  },
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
  lint,
  'lint:watch': {
    ...lint,
    alias: 'esw',
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...argv,
      '-w',
      '--rule "prettier/prettier: off"',
      '--quiet',
    ],
  },

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
