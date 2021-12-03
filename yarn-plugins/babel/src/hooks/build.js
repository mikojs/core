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
      const binaries = await scriptUtils.getWorkspaceAccessibleBinaries(
        workspace,
      );

      if (!binaries.has('babel'))
        return {
          ...result,
          notUseBabelWorkspaces: [...result.notUseBabelWorkspaces, workspace],
        };

      const { locator } = workspace;
      const name = structUtils.stringifyIdent(locator);
      const isBabelWorkspace =
        /^(@(?!babel\/)[^/]+\/)([^/]*babel-(preset|plugin)(?:-|\/|$)|[^/]+\/)/.test(
          name,
        ) || /^babel-(preset|plugin)/.test(name);

      return {
        ...result,
        babelWorkspaces: !isBabelWorkspace
          ? result.babelWorkspaces
          : [...result.babelWorkspaces, workspace],
      };
    },
    Promise.resolve({
      babelWorkspaces: [],
      notUseBabelWorkspaces: [],
    }),
  );

  if (babelWorkspaces.length !== 0)
    await cli.run(
      buildArgv([
        '--include',
        babelWorkspaces
          .map(({ locator }) => structUtils.stringifyIdent(locator))
          .join(','),
      ]),
    );

  await cli.run(
    buildArgv([
      '--exclude',
      notUseBabelWorkspaces
        .map(({ locator }) => structUtils.stringifyIdent(locator))
        .join(','),
    ]),
  );
};
