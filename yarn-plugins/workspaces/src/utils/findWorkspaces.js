import { execUtils, structUtils } from '@yarnpkg/core';

export default async (workspaces, { gitRange, cwd }) => {
  const { stdout } = await execUtils.execvp(
    'git',
    ['diff', '--name-only', gitRange],
    {
      cwd,
      strict: true,
    },
  );
  const files = stdout.split(/\r?\n/);

  return workspaces.reduce(
    (result, { relativeCwd, locator }) => !files.some(file => file.startsWith(relativeCwd))
      ? result
      : [
        ...result,
        '--include',
        structUtils.stringifyIdent(locator),
      ],
    [],
  );
};
