// @flow

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'koa',
    '@cat-org/server',
    '@cat-org/koa-base',
  ],
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
