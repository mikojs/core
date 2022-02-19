/**
 * FIXME
 * https://github.com/arcanis/clipanion/blob/e32ee0143363414f0ef796fac11c954cac14ba48/sources/advanced/options/utils.ts#L7
 * https://github.com/arcanis/clipanion/blob/e32ee0143363414f0ef796fac11c954cac14ba48/sources/advanced/Cli.ts#L377
 * Owing to Symbol, this is different between `factory require` and `.yarn/cache`.
 */
module.exports = {
  name: '@yarnpkg/plugin-clean',
  factory: require => {
    const { structUtils } = require('@yarnpkg/core');
    const { xfs, ppath } = require('@yarnpkg/fslib');

    return {
      hooks: {
        build: tasks =>
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
          }),
      },
    };
  },
};
