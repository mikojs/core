import { structUtils, SettingsType } from '@yarnpkg/core';
import stringArgv from 'string-argv';

export const configuration = {
  description: 'Build command for babel',
  type: SettingsType.STRING,
  default: 'src -d lib --verbose --root-mode upward',
};

export default async ({ cli, workspaces, configuration }) => {
  const argv = stringArgv(configuration.get('babel').get('build'));

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
