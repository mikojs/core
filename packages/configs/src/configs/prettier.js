// @flow

export default {
  install: (install: $ReadOnlyArray<string>) => [...install, 'prettier'],
  config: () => ({
    singleQuote: true,
    trailingComma: 'all',
  }),
  run: (argv: $ReadOnlyArray<string>) => [...argv, '--write'],
};
