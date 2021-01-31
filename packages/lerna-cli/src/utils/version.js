// @flow

import fs from 'fs';
import path from 'path';

import { load } from 'lerna-changelog/lib/configuration';
import Changelog from 'lerna-changelog/lib/changelog';
import execa from 'execa';

export default async (nextVersion: string) => {
  const changelog = await new Changelog({
    ...load(),
    nextVersion,
  }).createMarkdown();
  const changelogFilePath = path.resolve('CHANGELOG.md');

  fs.writeFileSync(
    changelogFilePath,
    fs
      .readFileSync(changelogFilePath, 'utf-8')
      .replace(/(# CHANGELOG)/, `$1\n${changelog}`),
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
