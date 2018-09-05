// @flow

const eslint = {
  config: (): {} => require('./eslint'),
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...argv,
    '--cache',
  ],
};

export default {
  // babel
  babel: (): {} => require('./babel'),

  // eslint
  eslint,
  esw: eslint,

  // prettier
  prettier: (): {} => require('./prettier'),

  // lint-staged
  'lint-staged': (): {} => require('./lintsteged'),

  // jest
  jest: (): {} => require('./jest'),
};
