// @flow

export default {
  // babel
  babel: (): {} => require('./babel'),

  // eslint
  eslint: (): {} => require('./eslint'),
  esw: (): {} => require('./eslint'),

  // prettier
  prettier: (): {} => require('./prettier'),

  // lint-staged
  'lint-staged': (): {} => require('./lintsteged'),

  // jest
  jest: (): {} => require('./jest'),
};
