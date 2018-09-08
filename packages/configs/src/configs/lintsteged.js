// @flow

export default {
  '*.js': [
    'yarn configs-scripts prettier',
    'yarn configs-scripts lint',
    'yarn flow focus-check',
    'git add',
  ],
  '*.js.flow': [
    'yarn configs-scripts prettier --parser flow',
    'yarn flow focus-check',
    'git add',
  ],
  '*.md': ['yarn configs-scripts prettier --parser markdown', 'git add'],
  'package.json': [
    'yarn prettier-package-json --write',
    'yarn configs-scripts prettier --parser json',
    'git add',
  ],
};
