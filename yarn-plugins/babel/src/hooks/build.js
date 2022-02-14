import { structUtils, scriptUtils } from '@yarnpkg/core';
import { xfs, ppath } from '@yarnpkg/fslib';

const BABEL_COMMANDS = [
  'babel',
  'src',
  '-d',
  'lib',
  '--root-mode',
  'upward',
  '--quiet',
];

export default async ({ workspaces, tasks }) => {
  const { babelWorkspaces, useBabelWorkspaces } = await workspaces.reduce(
    async (resultPromise, workspace) => {
      const result = await resultPromise;
      const binaries = await scriptUtils.getWorkspaceAccessibleBinaries(
        workspace,
      );
      const { locator } = workspace;
      const name = structUtils.stringifyIdent(locator);
      const isBabelWorkspace =
        /^(@(?!babel\/)[^/]+\/)([^/]*babel-(preset|plugin)(?:-|\/|$)|[^/]+\/)/.test(
          name,
        ) || /^babel-(preset|plugin)/.test(name);

      return {
        babelWorkspaces: !isBabelWorkspace
          ? result.babelWorkspaces
          : [...result.babelWorkspaces, workspace],
        useBabelWorkspaces: !binaries.has('babel')
          ? result.useBabelWorkspaces
          : [...result.useBabelWorkspaces, workspace],
      };
    },
    Promise.resolve({
      babelWorkspaces: [],
      useBabelWorkspaces: [],
    }),
  );

  tasks.add({
    title: 'Run babel plugin',
    task: (ctx, task) =>
      task.newListr([
        {
          title: 'Preparing babel presets/plugins in workspaces',
          enabled: () => babelWorkspaces.length !== 0,
          task: () =>
            Promise.all(
              babelWorkspaces.map(async ({ cwd, manifest: { main } }) => {
                const mainFilePath = ppath.join(cwd, main);
                const mainDirPath = ppath.dirname(mainFilePath);

                if (!xfs.existsSync(mainDirPath))
                  await xfs.mkdirPromise(mainDirPath, { recursive: true });

                if (!xfs.existsSync(mainFilePath))
                  await xfs.writeFilePromise(
                    mainFilePath,
                    'module.exports = function fakeBabel() { return {}; }',
                  );
              }),
            ),
        },
        {
          title: 'Building babel presets/plugins in workspaces',
          enabled: () => babelWorkspaces.length !== 0,
          task: async ({ runWithWorkspaces }) => {
            process.env.BABEL_ENV = 'pre';
            await runWithWorkspaces(BABEL_COMMANDS, babelWorkspaces);
            delete process.env.BABEL_ENV;
          },
        },
        {
          title: 'Building workspaces with babel',
          enabled: () => useBabelWorkspaces.length !== 0,
          task: ({ runWithWorkspaces }) =>
            runWithWorkspaces(BABEL_COMMANDS, useBabelWorkspaces),
        },
      ]),
  });
};
