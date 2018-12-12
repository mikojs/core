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
  appDir: string,
  cmd: string,
} => {
  const program = new commander.Command('create-app')
    .version(version, '-v, --version')
    .arguments('<app directory>')
    .usage(chalk`{green <app directory>}`)
    .option('--npm', 'use npm');

  const {
    args: [appDir],
    npm = false,
  } = program.parse([...argv]);

  if (!appDir) logger.fail(chalk`{red \`app directory\`} is required.`);

  const cliOptions = {
    appDir: path.resolve(appDir),
    cmd: npm ? 'npm' : 'yarn',
  };

  debugLog(cliOptions);

  return cliOptions;
};
