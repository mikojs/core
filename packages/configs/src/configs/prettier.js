// @flow

export default {
  install: (install: $ReadOnlyArray<string>) => [...install, 'prettier'],
  config: () => ({
    singleQuote: true,
    trailingComma: 'all',
  }),
  ignoreName: '.prettierignore',
  run: (argv: $ReadOnlyArray<string>) => [...argv, '--write'],
  configFiles: {
    prettier: '.prettierrc.js',
  },
};
