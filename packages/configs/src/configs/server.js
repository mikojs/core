// @flow

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install.filter((text: string) => text !== '--dev'),
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
