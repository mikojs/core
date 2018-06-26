// @flow

export default {
  '*.js': ['yarn prettier --write', 'yarn flow', 'yarn lint', 'git add'],
  'package.json': [
    'yarn prettier-package-json --write',
    'yarn prettier --parser json --write',
    'git add',
  ],
  '*.md': ['yarn prettier --parser markdown --write', 'git add'],
};
