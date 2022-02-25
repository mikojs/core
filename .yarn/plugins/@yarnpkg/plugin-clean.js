/**
 * FIXME
 * https://github.com/arcanis/clipanion/blob/e32ee0143363414f0ef796fac11c954cac14ba48/sources/advanced/options/utils.ts#L7
 * https://github.com/arcanis/clipanion/blob/e32ee0143363414f0ef796fac11c954cac14ba48/sources/advanced/Cli.ts#L377
 *
 * Owing to Symbol, `isOptionSymbol` is different between `factory require` and `.yarn/cache`.
 * As a result, we need to remove lib folder in `@mikojs/yarn-plugin-*`, and let cli to run bundle files.
 */
module.exports = {
  name: '@yarnpkg/plugin-clean',
  factory: require => {
    const { structUtils } = require('@yarnpkg/core');
    const { xfs, ppath } = require('@yarnpkg/fslib');

    const build = tasks =>
      tasks.add({
        title: 'Remove lib folder in @mikojs/yarn-plugin-*',
        task: ({ workspaces }) =>
          Promise.all(
            workspaces.map(async ({ locator, cwd }) => {
              if (!/yarn-plugin/.test(structUtils.stringifyIdent(locator)))
                return;

              await xfs.rmdirPromise(ppath.join(cwd, './lib'), {
                recursive: true,
                force: true,
              });
            }),
          ),
      });

    return {
      hooks: {
        build,
        'build:babel': build,
      },
    };
  },
};
