// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { createLogger } from '@mikojs/utils';

import { version } from '../../package.json';

const debugLog = debug('badges:getOptions');
const logger = createLogger('@mikojs/badges');

/**
 * @example
 * getOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {Array<string>} - options
 */
export default (
  argv: $ReadOnlyArray<string>,
): Promise<$ReadOnlyArray<string>> =>
  new Promise(resolve => {
    const program = new commander.Command('badges')
      .version(version, '-v, --version')
      .arguments('[readmePaths...]')
      .usage(chalk`{green [readmePaths...]}`)
      .description(
        chalk`Example:
  badges {green readmePath},
  badges {green readmePath1 readmePath2}`,
      )
      .action((readmePaths: $ReadOnlyArray<string>) => {
        debugLog(readmePaths);
        resolve(readmePaths);
      });

    debugLog(argv);

    if (argv.length !== 2) program.parse([...argv]);
    else {
      logger
        .fail(chalk`Must give {green readme path}`)
        .fail(chalk`Use {green \`--help\`} to get the more information`);
      resolve([]);
    }
  });
