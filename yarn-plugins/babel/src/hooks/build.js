import { structUtils } from '@yarnpkg/core';

export default async ({ cli, workspaces }) => {
  await Promise.all(
    workspaces
      .reduce((result, { manifest, cwd, ...workspace }) => {
        let shouldRunBabel = false;

        manifest.devDependencies.forEach(locator => {
          shouldRunBabel ||= structUtils.stringifyIdent(locator) === '@babel/cli';
        });

        return !shouldRunBabel ? result : [
          ...result,
          cli.run([
            'babel',
            'src',
            '-d',
            'lib',
            '--verbose',
            '--root-mode',
            'upward',
          ], { cwd }),
        ];
      }, [])
  );
};
