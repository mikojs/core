// @flow

import path from 'path';

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../package.json';

import logger from './logger';
import { type ctxType } from 'stores';

const debugLog = debug('create-project:cliOptions');

export default (argv: $ReadOnlyArray<string>): ctxType => {
  const program = new commander.Command('create-project')
    .version(version, '-v, --version')
    .arguments('<project directory>')
    .usage(chalk`{green <project directory>}`)
    .option('--npm', 'use npm');

  const {
    args: [projectDir],
    npm = false,
  } = program.parse([...argv]);

  if (!projectDir)
    throw logger.fail(chalk`{red \`project directory\`} is required.`);

  const cliOptions = {
    projectDir: path.resolve(projectDir),
    cmd: npm ? 'npm' : 'yarn',
  };

  debugLog(cliOptions);

  return cliOptions;
};
