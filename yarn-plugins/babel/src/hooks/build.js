import { structUtils } from '@yarnpkg/core';

export default async ({ cli, workspaces }) => {
  const babelWorkspaces = workspaces.reduce((result, { locator }) => {
    const name = structUtils.stringifyIdent(locator);
    const isBabelWorkspace =
      /^(@(?!babel\/)[^/]+\/)([^/]*babel-(preset|plugin)(?:-|\/|$)|[^/]+\/)/.test(
        name,
      ) || /^babel-(preset|plugin)/.test(name);

    return !isBabelWorkspace ? result : [...result, name];
  }, []);

  if (babelWorkspaces.length !== 0)
    await cli.run([
      'workspaces',
      'foreach',
      '-pAv',
      '--include',
      babelWorkspaces.join(','),
      'exec',
      // FIXME: rewrite after workspace-tools >= 3.1.1
      'run',
      'babel',
      'src',
      '-d',
      'lib',
      '--verbose',
      '--root-mode',
      'upward',
    ]);
};
