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

export default tasks => {
  tasks.add({
    title: 'Run babel plugin',
    task: async ({ workspaces }, task) => {
      return task.newListr([
        {
          title: 'Preparing babel presets/plugins in workspaces',
          enabled: async ctx => {
            const { workspaces } = ctx;
            const babelWorkspaces = await workspaces.reduce(
              async (resultPromise, workspace) => {
                const result = await resultPromise;
                const { locator } = workspace;
                const name = structUtils.stringifyIdent(locator);
                const isBabelWorkspace =
                  /^(@(?!babel\/)[^/]+\/)([^/]*babel-(preset|plugin)(?:-|\/|$)|[^/]+\/)/.test(
                    name,
                  ) || /^babel-(preset|plugin)/.test(name);

                return !isBabelWorkspace ? result : [...result, workspace];
              },
              Promise.resolve([]),
            );

            ctx.babelWorkspaces = babelWorkspaces;

            return babelWorkspaces.length !== 0;
          },
          task: ({ babelWorkspaces }) =>
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
          enabled: ({ babelWorkspaces }) => babelWorkspaces?.length !== 0,
          task: async ({ babelWorkspaces, runWithWorkspaces }) => {
            process.env.BABEL_ENV = 'pre';
            await runWithWorkspaces(BABEL_COMMANDS, babelWorkspaces);
            delete process.env.BABEL_ENV;
          },
        },
        {
          title: 'Building workspaces with babel',
          enabled: async (ctx) => {
            const useBabelWorkspaces = await workspaces.reduce(
              async (resultPromise, workspace) => {
                const result = await resultPromise;
                const binaries = await scriptUtils.getWorkspaceAccessibleBinaries(
                  workspace,
                );

                return !binaries.has('babel') ? result : [...result, workspace];
              },
              Promise.resolve([]),
            );

            ctx.useBabelWorkspaces = useBabelWorkspaces;

            return useBabelWorkspaces.length !== 0;
          },
          task: ({ runWithWorkspaces }) =>
            runWithWorkspaces(BABEL_COMMANDS, useBabelWorkspaces),
        },
      ]);
    },
  });
};
