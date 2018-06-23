// @flow

export default {
  '*.js': [
    'yarn prettier',
    'git add',
  ],
  'package.json': [
    'yarn prettier-package-json',
    'git add',
  ],
};
