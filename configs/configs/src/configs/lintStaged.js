// @flow

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'lint-staged',
    'prettier-package-json',
    '@mikojs/badges',
  ],
  config: () => ({
    '*.js': ['configs prettier', 'configs lint'],
    '*.js.flow': ['configs prettier --parser flow'],
    '**/!(README).md': ['configs prettier --parser markdown'],
    '**/README.md': ['badges', 'configs prettier --parser markdown'],
    '**/package.json': [
      'prettier-package-json --write',
      'configs prettier --parser json',
    ],
  }),
  configsFiles: {
    'lint-staged': '.lintstagedrc.js',
    prettier: true,
    lint: true,
  },
};
