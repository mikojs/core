// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../package.json';

import logger from './logger';

const debugLog = debug('badges:cliOptions');

/**
 * @example
 * cliOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {options} - cli options
 */
export default (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => {
  const program = new commander.Command('badges')
    .version(version, '-v, --version')
    .arguments('[readme path]')
    .usage(chalk`{green [readme path]}`)
    .description(
      chalk`Example:
  badges {green readme path}`,
    );

  const { args } = program.parse([...argv]);

  if (args.length === 0)
    throw logger.fail(
      chalk`Must give {green readme path}`,
      chalk`Use {green \`--help\`} to get the more information`,
    );

  debugLog(args);

  return args;
};
