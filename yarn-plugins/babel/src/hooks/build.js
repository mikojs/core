import { structUtils, scriptUtils } from '@yarnpkg/core';
import { xfs, ppath } from '@yarnpkg/fslib';

const BABEL_COMMANDS = [
  'babel',
  'src',
  '-d',
  'lib',
  '--root-mode',
  'upward',
  '--verbose',
];

const preparePlugin = {
  title: 'Prepare babel plugin',
  task: async ctx => {
    const { workspaces } = ctx;

    ctx.babelWorkspaces = [];
    ctx.useBabelWorkspaces = [];

    await workspaces.reduce(async (result, workspace) => {
      await result;

      const binaries = await scriptUtils.getWorkspaceAccessibleBinaries(
        workspace,
      );
      const { locator } = workspace;
      const name = structUtils.stringifyIdent(locator);
      const isBabelWorkspace =
        /^(@(?!babel\/)[^/]+\/)([^/]*babel-(preset|plugin)(?:-|\/|$)|[^/]+\/)/.test(
          name,
        ) || /^babel-(preset|plugin)/.test(name);

      if (isBabelWorkspace) ctx.babelWorkspaces.push(workspace);

      if (binaries.has('babel')) ctx.useBabelWorkspaces.push(workspace);
    }, Promise.resolve());
  },
};

const prepareBabelWorkspaces = {
  title: 'Prepare babel presets/plugins in workspaces',
  enabled: ({ babelWorkspaces }) => babelWorkspaces?.length !== 0,
  task: async ctx => {
    const { babelWorkspaces } = ctx;

    ctx.babelEnv = process.env.BABEL_ENV;
    process.env.BABEL_ENV = 'pre';

    await Promise.all(
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
    );
  },
};

const buildBabelWorkspaces = {
  title: 'Build babel presets/plugins in workspaces',
  enabled: ({ babelWorkspaces }) => babelWorkspaces?.length !== 0,
  task: ({ babelWorkspaces, workspacesTasks }, task) =>
    workspacesTasks(task, babelWorkspaces, BABEL_COMMANDS),
};

const resetBabelEnv = {
  title: 'Reset BABEL_ENV',
  enabled: ({ babelWorkspaces }) => babelWorkspaces?.length !== 0,
  task: ({ babelEnv }) => {
    process.env.BABEL_ENV = babelEnv;
  },
};

const buildWorkspaces = {
  title: 'Build workspaces with babel',
  enabled: ({ useBabelWorkspaces }) => useBabelWorkspaces?.length !== 0,
  task: ({ useBabelWorkspaces, workspacesTasks }, task) =>
    workspacesTasks(task, useBabelWorkspaces, BABEL_COMMANDS),
};

export default tasks =>
  tasks.add({
    title: 'Run babel plugin',
    task: ({ normalizeTasks }, task) =>
      normalizeTasks(task, [
        preparePlugin,
        prepareBabelWorkspaces,
        buildBabelWorkspaces,
        resetBabelEnv,
        buildWorkspaces,
      ]),
  });
