// @flow

export default {
  '*.js': ['yarn prettier --write', 'git add'],
  'package.json': ['yarn prettier-package-json --write', 'git add'],
};
