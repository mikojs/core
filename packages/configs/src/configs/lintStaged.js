// @flow

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'lint-staged',
    'prettier-package-json',
    '@mikojs/badges',
  ],
  config: () => ({
    '*.js': ['miko prettier', 'miko lint'],
    '*.js.flow': ['miko prettier --parser flow'],
    '**/!(README).md': ['miko prettier --parser markdown'],
    '**/README.md': ['badges', 'miko prettier --parser markdown'],
    '**/package.json': [
      'prettier-package-json --write',
      'miko prettier --parser json',
    ],
  }),
  configsFiles: {
    'lint-staged': '.lintstagedrc.js',
    prettier: true,
    lint: true,
  },
};
