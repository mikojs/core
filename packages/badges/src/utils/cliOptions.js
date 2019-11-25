// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { createLogger } from '@mikojs/utils';

import { version } from '../../package.json';

const debugLog = debug('badges:cliOptions');
const logger = createLogger('@mikojs/badges');

/**
 * @example
 * cliOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {Array<string>} - cli options
 */
export default (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => {
  const { args } = new commander.Command('badges')
    .version(version, '-v, --version')
    .arguments('[readme-path...]')
    .usage(chalk`{green [readme-path...]}`)
    .description(
      chalk`Example:
  badges {green readme-path}`,
    )
    .parse([...argv]);

  if (args.length === 0) {
    logger
      .fail(chalk`Must give {green readme path}`)
      .fail(chalk`Use {green \`--help\`} to get the more information`);
    return [];
  }

  debugLog(args);

  return args;
};
