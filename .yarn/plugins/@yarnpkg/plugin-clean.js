module.exports = {
  name: '@yarnpkg/plugin-clean',
  factory: fn => {
    const { structUtils } = fn('@yarnpkg/core');
    const { xfs, ppath } = fn('@yarnpkg/fslib');

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
