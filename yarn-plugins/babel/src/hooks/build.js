import { structUtils } from '@yarnpkg/core';

const buildArgv = (argv = []) => [
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
  const {
    names,
    babelNames,
  } = workspaces.reduce((result, { locator }) => {
    const name = structUtils.stringifyIdent(locator);
    const isBabelWorkspace =
      /^(@(?!babel\/)[^/]+\/)([^/]*babel-(preset|plugin)(?:-|\/|$)|[^/]+\/)/.test(
        name,
      ) || /^babel-(preset|plugin)/.test(name);

    return {
      names: [...result.names, name],
      babelNames: !isBabelWorkspace ? result.babelNames : [...result.babelNames, name],
    };
  }, {
    names: [],
    babelNames: [],
  });

  if (babelNames.length !== 0)
    await cli.run(buildArgv(['--include', babelNames.join(',')]));

  await cli.run(buildArgv());
};
