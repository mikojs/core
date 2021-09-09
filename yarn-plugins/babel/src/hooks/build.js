import { structUtils } from '@yarnpkg/core';

export default async ({ cli, workspaces }) => {
  await Promise.all(
    workspaces
      .filter(({ manifest }) =>
        Array.from(manifest.devDependencies.values())
          .some(locator => structUtils.stringifyIdent(locator) === '@babel/cli')
      )
      .map(({ cwd }) => cli.run([
        'babel',
        'src',
        '-d',
        'lib',
        '--verbose',
        '--root-mode',
        'upward',
      ], {
        cwd,
      }))
  );
};
