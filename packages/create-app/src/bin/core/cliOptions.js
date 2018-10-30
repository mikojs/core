// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../../package.json';

import logger from 'utils/logger';

const debugLog = debug('create-cat:cliOptions');

const program = new commander.Command('create-cat')
  .version(version, '-v, --version')
  .arguments('<project-directory>')
  .usage(chalk`{green <project-directory>}`);

const {
  args: [projectDir],
} = program.parse(process.argv);

debugLog({
  projectDir,
});

if (!projectDir)
  logger.fail(chalk`{red Error: <project-directory> is required.}`);

export default {
  projectDir,
};
