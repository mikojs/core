// @flow

export default {
  '*.js': [
    'yarn prettier --write',
    'yarn flow focus-check',
    'yarn lint',
    'git add',
  ],
  '*.js.flow': ['yarn prettier --write', 'yarn flow focus-check', 'git add'],
  '*.md': ['yarn prettier --parser markdown --write', 'git add'],
  'package.json': [
    'yarn prettier-package-json --write',
    'yarn prettier --parser json --write',
    'git add',
  ],
};
