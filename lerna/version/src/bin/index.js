#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import Changelog from 'lerna-changelog/lib/changelog';
import { load as loadConfig } from 'lerna-changelog/lib/configuration';
import execa from 'execa';

import { handleUnhandledRejection } from '@mikojs/utils';
import commander from '@mikojs/commander';

import { version } from '../../package.json';

handleUnhandledRejection();

const parseArgv = commander<[string]>({
  name: 'lerna-version',
  version,
  description: chalk`Generate {green CHANGELOG.md} with {green lerna version}.`,
  args: '<version>',
});

(async () => {
  const [nextVersion] = await parseArgv(process.argv);
  const config = loadConfig({
    nextVersionFromMetadata: version,
  });
  const changelog = await new Changelog({
    ...config,
    nextVersion,
  }).createMarkdown();
  const changelogFilePath = path.resolve('CHANGELOG.md');

  fs.writeFileSync(
    changelogFilePath,
    fs.readFileSync(changelogFilePath, 'utf-8').replace(
      /(# CHANGELOG)/,
      `$1
${changelog}`,
    ),
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
})();
