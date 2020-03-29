// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../package.json';

export type optionsType =
  | {|
      type: 'start',
      configNames: $ReadOnlyArray<string>,
    |}
  | {|
      type: 'kill' | 'init',
    |};

const debugLog = debug('miko:getOptions');

/**
 * @example
 * getOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {optionsType} - options
 */
export default (argv: $ReadOnlyArray<string>): Promise<optionsType> =>
  new Promise((resolve, reject) => {
    const program = new commander.Command('miko')
      .version(version, '-v, --version')
      .arguments('[configNames...]')
      .description(
        chalk`Example:
  miko
  miko {green babel}
  miko {cyan start} {green babel}
  miko {cyan kill}
  miko {cyan init}`,
      )
      .parse([...argv])
      .action((configNames: $ReadOnlyArray<string>) => {
        debugLog(configNames);
        resolve({ type: 'start', configNames });
      });

    program
      .command('start')
      .arguments('[configNames...]')
      .description('trigger the start event to generate the files')
      .action((configNames: $ReadOnlyArray<string>) => {
        debugLog(configNames);
        resolve({ type: 'start', configNames });
      });

    program
      .command('kill')
      .description('kill the all events')
      .action(() => {
        resolve({ type: 'kill' });
      });

    program
      .command('init')
      .description('initialize the scripts of the package.json')
      .action(() => {
        resolve({ type: 'init' });
      });

    debugLog(argv);

    if (argv.length !== 2) program.parse([...argv]);
    else resolve({ type: 'start', configNames: [] });
  });
