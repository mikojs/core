import fs from 'fs';
import path from 'path';

import execa from 'execa';

export default async nextVersion => {
  const { stdout } = await execa('lerna-changelog', [
    '--nextVersion',
    nextVersion,
  ]);
  const changelogFilePath = path.resolve('CHANGELOG.md');
  const { name } = require(path.resolve('package.json'));

  if (!stdout.replace('\n', ''))
    throw new Error('Could not find anything to release');

  fs.writeFileSync(
    changelogFilePath,
    fs
      .readFileSync(changelogFilePath, 'utf-8')
      .replace(/(# CHANGELOG)/, `$1\n${stdout}`),
  );

  await [
    ['git', 'add', changelogFilePath],
    ['git', 'commit', '-m', `chore(${name}): add CHANGELOG.md`],
    ['lerna', 'version', nextVersion],
  ].reduce(async (result, commands) => {
    await result;
    await execa(commands[0], commands.slice(1), {
      stdio: 'inherit',
    });
  }, Promise.resolve());
};
