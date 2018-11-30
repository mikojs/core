// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../package.json';

const debugLog = debug('cli:cliOptions');

export default (argv: $ReadOnlyArray<string>): {} => {
  const program = new commander.Command('cli')
    .version(version, '-v, --version')
    .arguments('<project-directory>')
    .usage(chalk`{green <project-directory>}`);

  program.parse([...argv]);

  const cliOptions = {};

  debugLog(cliOptions);

  return cliOptions;
};
