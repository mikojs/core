#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import execa from 'execa';
import Listr from 'listr';

import { handleUnhandledRejection } from '@cat-org/logger';

import cliOptions from './core/cliOptions';

const DEFAULT_CONFIGS = ['babel', 'prettier', 'lint', 'lint-staged', 'jest'];

if (!fs.existsSync(cliOptions.projectDir)) fs.mkdirSync(cliOptions.projectDir);

handleUnhandledRejection();

(async (): Promise<void> => {
  const root = path.resolve(cliOptions.projectDir);

  await new Listr([
    {
      title: 'Git init',
      // TODO check git exist
      task: () => execa('git', ['init']),
    },
    {
      title: chalk`Install {green @cat-org/configs}`,
      // TODO remove after @cat-org/configs production
      task: () =>
        execa(
          cliOptions.cmd,
          [cliOptions.install, '@cat-org/configs@beta', cliOptions.dev],
          {
            cwd: root,
          },
        ),
    },
    {
      title: 'Install default packages',
      task: () =>
        new Listr(
          DEFAULT_CONFIGS.map((configName: string) => ({
            title: chalk`Install devDependencies in {green ${configName}}`,
            task: () =>
              execa('configs-scripts', ['--install', configName], {
                cwd: root,
              }),
          })),
        ),
    },
  ]).run();
})();
