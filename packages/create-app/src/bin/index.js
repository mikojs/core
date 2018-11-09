#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import execa from 'execa';
import Listr from 'listr';

import { handleUnhandledRejection } from '@cat-org/utils';

import cliOptions from 'utils/cliOptions';

handleUnhandledRejection();

(async (): Promise<void> => {
  const { projectDir, cmd } = cliOptions(process.argv);
  const cmdOptions = {
    cwd: path.resolve(projectDir),
  };

  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);

  await new Listr([
    {
      title: 'Initialization',
      // TODO check git exist
      task: () =>
        new Listr(
          [
            {
              title: 'git',
              cmds: ['git', 'init'],
            },
            {
              title: chalk`install {green @cat-org/configs}`,
              cmds: [
                cmd,
                // TODO remove after @cat-org/configs production
                ...(cmd === 'npm' ? ['install', '-D'] : ['add', '--dev']),
                '@cat-org/configs@beta',
                'regenerator-runtime',
              ],
            },
          ].map(
            ({
              title,
              cmds,
            }: {
              title: string,
              cmds: $ReadOnlyArray<string>,
            }) => ({
              title,
              task: () => execa(cmds[0], cmds.slice(1), cmdOptions),
            }),
          ),
        ),
    },
    {
      title: 'Install default packages',
      task: () =>
        new Listr(
          ['babel', 'prettier', 'lint', 'lint-staged', 'jest'].map(
            (configName: string) => ({
              title: configName,
              task: () =>
                execa('configs-scripts', ['--install', configName], cmdOptions),
            }),
          ),
        ),
    },
  ]).run();
})();
