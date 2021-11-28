import { structUtils, scriptUtils } from '@yarnpkg/core';

const buildArgv = argv => [
  'workspaces',
  'foreach',
  '-pAv',
  ...argv,
  // FIXME: use `workspaces foreach run` after workspace-tools >= 3.1.1
  'exec',
  'run',
  'babel',
  'src',
  '-d',
  'lib',
  '--verbose',
  '--root-mode',
  'upward',
];

export default async ({ cli, workspaces }) => {
  const { babelWorkspaces, notUseBabelWorkspaces } = await workspaces.reduce(
    async (resultPromise, workspace) => {
      const result = await resultPromise;
      const { locator } = workspace;
      const name = structUtils.stringifyIdent(locator);
      const binaries = await scriptUtils.getWorkspaceAccessibleBinaries(
        workspace,
      );

      if (!binaries.has('babel'))
        return {
          ...result,
          notUseBabelWorkspaces: [...result.notUseBabelWorkspaces, name],
        };

      const isBabelWorkspace =
        /^(@(?!babel\/)[^/]+\/)([^/]*babel-(preset|plugin)(?:-|\/|$)|[^/]+\/)/.test(
          name,
        ) || /^babel-(preset|plugin)/.test(name);

      return {
        ...result,
        babelWorkspaces: !isBabelWorkspace
          ? result.babelWorkspaces
          : [...result.babelWorkspaces, name],
      };
    },
    Promise.resolve({
      babelWorkspaces: [],
      notUseBabelWorkspaces: [],
    }),
  );

  if (babelWorkspaces.length !== 0)
    await cli.run(buildArgv(['--include', babelWorkspaces.join(',')]));

  await cli.run(buildArgv(['--exclude', notUseBabelWorkspaces.join(',')]));
};
