#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import execa from 'execa';
import Listr from 'listr';

import { handleUnhandledRejection } from '@cat-org/logger';

import cliOptions from './core/cliOptions';

if (!fs.existsSync(cliOptions.projectDir)) fs.mkdirSync(cliOptions.projectDir);

handleUnhandledRejection();

(async (): Promise<void> => {
  const execaOptions = {
    cwd: path.resolve(cliOptions.projectDir),
  };

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
                cliOptions.cmd,
                // TODO remove after @cat-org/configs production
                cliOptions.install,
                '@cat-org/configs@beta',
                'regenerator-runtime',
                cliOptions.dev,
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
              task: () => execa(cmds[0], cmds.slice(1), execaOptions),
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
                execa(
                  'configs-scripts',
                  ['--install', configName],
                  execaOptions,
                ),
            }),
          ),
        ),
    },
  ]).run();
})();
