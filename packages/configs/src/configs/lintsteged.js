// @flow

export default {
  install: (install: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...install,
    'husky',
    'lint-staged',
    'prettier-package-json',
    '@cat-org/badges',
  ],
  config: (): {} => ({
    '*.js': ['yarn configs prettier', 'yarn configs lint', 'git add'],
    '*.js.flow': ['yarn configs prettier --parser flow', 'git add'],
    '*.md': ['yarn configs prettier --parser markdown', 'git add'],
    '**/README.md': [
      'badges',
      'yarn configs prettier --parser markdown',
      'git add',
    ],
    '**/package.json': [
      'yarn prettier-package-json --write',
      'yarn configs prettier --parser json',
      'git add',
    ],
  }),
  configFiles: {
    prettier: true,
    lint: true,
  },
};
