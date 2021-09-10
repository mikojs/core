import { structUtils, SettingsType } from '@yarnpkg/core';
import stringArgv from 'string-argv';

export default async ({ cli, workspaces, configs }) => {
  const argv = stringArgv(configs?.build?.babel || 'src -d lib --verbose --root-mode upward');

  await Promise.all(
    workspaces
      .reduce((result, { manifest, cwd }) => {
        let shouldRunBabel = false;

        manifest.devDependencies.forEach(locator => {
          shouldRunBabel ||= structUtils.stringifyIdent(locator) === '@babel/cli';
        });

        return !shouldRunBabel ? result : [
          ...result,
          cli.run(['babel', ...argv], { cwd }),
        ];
      }, [])
  );
};
