#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import execa from 'execa';
import Listr from 'listr';
import nunjucks from 'nunjucks';
import outputFileSync from 'output-file-sync';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import cliOptions from 'utils/cliOptions';
import pkg from 'caches/pkg';

handleUnhandledRejection();
nunjucks.configure(path.resolve(__dirname, '../../templates'));

(async (): Promise<void> => {
  const { projectDir, cmd } = cliOptions(process.argv);
  const cmdOptions = { cwd: projectDir };

  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);
  else
    logger.fail(
      chalk`The directory {green ${projectDir}} exists`,
      `Remove this directory or use a new name`,
    );

  const caches = {
    'package.json': JSON.stringify(await pkg.get(projectDir), null, 2),
    '.gitignore': nunjucks.render('gitignore'),
    '.flowconfig': nunjucks.render('flowconfig'),
  };
  const { log } = console;

  logger.info(chalk`Creating a new app in {green ${projectDir}}`);
  log();

  await new Listr([
    {
      title: 'write files',
      task: () =>
        new Listr(
          Object.keys(caches).map((filePath: string) => ({
            title: filePath,
            task: () =>
              outputFileSync(
                path.resolve(projectDir, filePath),
                caches[filePath],
              ),
          })),
        ),
    },
    {
      title: 'initialization',
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
      title: 'install default packages',
      task: () =>
        new Listr([
          ...['babel', 'prettier', 'lint', 'lint-staged', 'jest'].map(
            (configName: string) => ({
              title: configName,
              task: () =>
                execa(
                  'configs-scripts',
                  [
                    '--install',
                    ...(cmd === 'npm' ? ['--npm'] : []),
                    configName,
                  ],
                  cmdOptions,
                ),
            }),
          ),
          {
            title: 'flow',
            task: () =>
              execa(
                cmd,
                [
                  ...(cmd === 'npm' ? ['install', '-D'] : ['add', '--dev']),
                  'flow-bin',
                  'flow-typed',
                ],
                cmdOptions,
              ),
          },
        ]),
    },
    {
      title: 'install flow-typed packages',
      task: () => execa.shell('yarn flow-typed install', cmdOptions),
    },
    {
      title: 'git first command',
      task: () =>
        new Listr(
          ['git add .', 'git commit -m "project init"'].map(
            (command: string) => ({
              title: command,
              task: () => execa.shell(command, cmdOptions),
            }),
          ),
        ),
    },
  ]).run();

  log();
  logger.succeed('Done.');
})();
