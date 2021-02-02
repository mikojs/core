// @flow

import fs from 'fs';
import path from 'path';

import execa from 'execa';

/**
 * @param {string} nextVersion - next version
 */
export default async (nextVersion: string) => {
  const { stdout } = await execa('lerna-changelog', [
    '--nextVersion',
    nextVersion,
  ]);
  const changelogFilePath = path.resolve('CHANGELOG.md');

  fs.writeFileSync(
    changelogFilePath,
    fs
      .readFileSync(changelogFilePath, 'utf-8')
      .replace(/(# CHANGELOG)/, `$1\n${stdout}`),
  );

  await [
    ['git', 'add', changelogFilePath],
    ['git', 'commit', '-m', 'chore(root): add CHANGELOG.md'],
    ['lerna', 'version', nextVersion],
  ].reduce(async (result: Promise<void>, commands: $ReadOnlyArray<string>) => {
    await result;
    await execa(commands[0], commands.slice(1), {
      stdio: 'inherit',
    });
  }, Promise.resolve());
};
