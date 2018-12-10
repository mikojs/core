#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import debug from 'debug';
import chalk from 'chalk';
import execa from 'execa';
import outputFileSync from 'output-file-sync';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import cliOptions from 'utils/cliOptions';
import pkg from 'caches/pkg';

const debugLog = debug('create-app:bin');
const WAIT_MESSAGE = 'This might take a couple of minutes.';

/**
 * @example
 * templateRender('file name')
 *
 * @param {string} fileName - file name of template
 *
 * @return {string} - render content
 */
const templateRender = (fileName: string): string =>
  fs.readFileSync(path.resolve(__dirname, '../../templates', fileName), 'utf8');

handleUnhandledRejection();

(async (): Promise<void> => {
  const { projectDir, cmd } = cliOptions(process.argv);
  const execaOptions = { cwd: projectDir };

  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);
  // TODO: add update
  else
    logger.fail(
      chalk`The directory {green ${projectDir}} exists`,
      `Remove this directory or use a new name`,
    );

  const caches = {
    'package.json': JSON.stringify(await pkg.get(projectDir), null, 2),
    '.gitignore': templateRender('gitignore'),
    '.flowconfig': templateRender('flowconfig'),
  };
  const configNames = ['babel', 'prettier', 'lint', 'lint-staged', 'jest'];

  logger.info(chalk`Creating a new app in {green ${projectDir}}`);

  logger.start(`Initializing the app. ${WAIT_MESSAGE}`);
  Object.keys(caches).map((filePath: string) => {
    const writeFile = [path.resolve(projectDir, filePath), caches[filePath]];

    debugLog(writeFile);
    outputFileSync(...writeFile);
  });

  await execa.shell('git init', execaOptions);
  await execa(
    cmd,
    [
      // TODO remove after @cat-org/configs production
      ...(cmd === 'npm' ? ['install', '-D'] : ['add', '--dev']),
      '@cat-org/configs@beta',
    ],
    execaOptions,
  );
  logger.succeed('The app has initialized.');

  logger.start(`Installing the packages. ${WAIT_MESSAGE}`);
  for (const configName of configNames) {
    await execa(
      'configs',
      ['--install', ...(cmd === 'npm' ? ['--npm'] : []), configName],
      execaOptions,
    );
  }
  await execa(
    cmd,
    [
      ...(cmd === 'npm' ? ['install', '-D'] : ['add', '--dev']),
      'flow-bin',
      'flow-typed',
    ],
    execaOptions,
  );
  logger.succeed('The packages have installed.');

  logger.start(`Installing the flow-typed packages. ${WAIT_MESSAGE}`);
  await execa.shell('yarn flow-typed install', execaOptions);
  logger.succeed('The flow-typed packages have installed.');

  logger.start(`Running the first commit. ${WAIT_MESSAGE}`);
  await execa.shell('git add .', execaOptions);
  await execa.shell('git commit -m "project init"', execaOptions);
  await execa.shell(
    `git remote add origin ${(await pkg.get(projectDir)).repository}`,
    execaOptions,
  );
  logger.succeed('The first commit has run.');

  // TODO checking
  logger.succeed('Done.');
})();
