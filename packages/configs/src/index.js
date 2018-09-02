// @flow

export default {
  'babel/react': {
    alias: 'babel',
    config: (): {} => require('./babel'),
  },
  babel: (): {} => require('./babel'),
  'lint-staged': (): {} => require('./lintsteged'),
  prettier: (): {} => require('./prettier'),
  jest: (): {} => require('./jest'),
};
