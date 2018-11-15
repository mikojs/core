// @flow

export default {
  install: (install: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...install,
    'husky',
    'lint-staged',
    'prettier-package-json',
  ],
  config: (): {} => ({
    '*.js': [
      'yarn configs-scripts prettier',
      'yarn configs-scripts lint',
      'git add',
    ],
    '*.js.flow': ['yarn configs-scripts prettier --parser flow', 'git add'],
    '*.md': ['yarn configs-scripts prettier --parser markdown', 'git add'],
    '**/package.json': [
      'yarn prettier-package-json --write',
      'yarn configs-scripts prettier --parser json',
      'git add',
    ],
  }),
  configFiles: {
    prettier: true,
    lint: true,
  },
};
