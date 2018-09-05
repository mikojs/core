// @flow

const eslint = {
  config: (): {} => require('./configs/eslint'),
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...argv,
    '--cache',
  ],
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
  jest: (): {} => require('./configs/jest'),
};
