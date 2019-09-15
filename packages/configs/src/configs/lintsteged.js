// @flow

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'husky',
    'lint-staged',
    'prettier-package-json',
    '@mikojs/badges',
  ],
  config: () => ({
    '*.js': ['yarn configs prettier', 'yarn configs lint', 'git add'],
    '*.js.flow': ['yarn configs prettier --parser flow', 'git add'],
    '**/!(README).md': ['yarn configs prettier --parser markdown', 'git add'],
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
    'lint-staged': '.lintstagedrc.js',
    prettier: true,
    lint: true,
  },
};
