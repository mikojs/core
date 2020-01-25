// @flow

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'lint-staged',
    'prettier-package-json',
    '@mikojs/badges',
  ],
  config: () => ({
    '*.js': ['yarn configs prettier', 'yarn configs lint'],
    '*.js.flow': ['yarn configs prettier --parser flow'],
    '**/!(README).md': ['yarn configs prettier --parser markdown'],
    '**/README.md': ['badges', 'yarn configs prettier --parser markdown'],
    '**/package.json': [
      'yarn prettier-package-json --write',
      'yarn configs prettier --parser json',
    ],
  }),
  configsFiles: {
    'lint-staged': '.lintstagedrc.js',
    prettier: true,
    lint: true,
  },
};
