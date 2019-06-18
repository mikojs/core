// @flow

export default {
  install: (install: $ReadOnlyArray<string>) => [...install, '@cat-org/server'],
  run: (argv: $ReadOnlyArray<string>) => [
    ...argv,
    'src',
    '-d',
    'lib',
    '--verbose',
  ],
  configFiles: {
    babel: true,
  },
};
