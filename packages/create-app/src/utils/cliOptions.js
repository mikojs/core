// @flow

import path from 'path';

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../package.json';

import logger from './logger';

const debugLog = debug('create-app:cliOptions');

export default (
  argv: $ReadOnlyArray<string>,
): {
  projectDir: string,
  cmd: string,
} => {
  const program = new commander.Command('create-app')
    .version(version, '-v, --version')
    .arguments('<project-directory>')
    .usage(chalk`{green <project-directory>}`)
    .option('--npm', 'use npm');

  const {
    args: [projectDir],
    npm = false,
  } = program.parse([...argv]);

  const cliOptions = {
    projectDir: path.resolve(projectDir),
    cmd: npm ? 'npm' : 'yarn',
  };

  debugLog(cliOptions);

  if (!projectDir) logger.fail(chalk`{red \`project-directory\`} is required.`);

  return cliOptions;
};
