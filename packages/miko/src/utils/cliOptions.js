// @flow

import commander from 'commander';
import chalk from 'chalk';

import { createLogger } from '@mikojs/utils';

import { version } from '../../package.json';

export type optionsType = 'start' | 'end' | 'init' | false;

const logger = createLogger('@mikojs/miko');

/**
 * @example
 * cliOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {optionsType} - cli options
 */
export default (argv: $ReadOnlyArray<string>): Promise<optionsType> =>
  new Promise((resolve, reject) => {
    const program = new commander.Command('miko')
      .version(version, '-v, --version')
      .description(
        chalk`Example:
  miko {cyan start}
  miko {cyan end}
  miko {cyan init}`,
      )
      .parse([...argv]);

    program
      .command('start')
      .description('trigger the start event to generate the files')
      .action(() => {
        resolve('start');
      });

    program
      .command('end')
      .description('trigger the end event to remove the files')
      .action(() => {
        resolve('end');
      });

    program
      .command('init')
      .description('initialize the scripts of the package.json')
      .action(() => {
        resolve('init');
      });

    if (argv.length !== 2) program.parse([...argv]);
    else {
      logger
        .fail(chalk`Should give an argument at least`)
        .fail(chalk`Use {green \`--help\`} to get the more information`);
      resolve(false);
    }
  });
