#! /usr/bin/env node
// @flow

import fs from 'fs';

import chalk from 'chalk';
import execa from 'execa';
import Listr from 'listr';

import { handleUnhandledRejection } from '@cat-org/utils';

import cliOptions from 'utils/cliOptions';
import pkg from 'caches/pkg';

handleUnhandledRejection();

(async (): Promise<void> => {
  const { projectDir, cmd } = cliOptions(process.argv);
  const cmdOptions = { cwd: projectDir };

  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);

  await pkg.get(projectDir);
  await new Listr([
    {
      title: 'Initialization',
      // TODO check git exist
      task: () =>
        new Listr(
          [
            {
              title: 'git',
              command: ['git', 'init'],
            },
            {
              title: chalk`install {green @cat-org/configs}`,
              command: [
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
              command,
            }: {
              title: string,
              command: $ReadOnlyArray<string>,
            }) => ({
              title,
              task: () => execa(command[0], command.slice(1), cmdOptions),
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
