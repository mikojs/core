// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../../package.json';

import logger from 'utils/logger';

const debugLog = debug('create-app:cliOptions');

const program = new commander.Command('create-app')
  .version(version, '-v, --version')
  .arguments('<project-directory>')
  .usage(chalk`{green <project-directory>}`)
  .option('--npm', 'use npm to install packages');

const {
  args: [projectDir],
  npm = false,
} = program.parse(process.argv);

const cliOptions = {
  projectDir,
  cmd: npm ? 'npm' : 'yarn',
  install: npm ? 'install' : 'add',
  dev: npm ? '-D' : '--dev',
};

debugLog(cliOptions);

if (!projectDir) logger.fail(chalk`{red \`project-directory\`} is required.`);

export default cliOptions;
