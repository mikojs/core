// @flow

import commander from 'commander';
import chalk from 'chalk';

import { version } from '../../package.json';

export type optionsType =
  | {|
      type: 'start',
      names: $ReadOnlyArray<string>,
    |}
  | {|
      type: 'end' | 'init',
    |};

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
      .description(
        chalk`Example:
  miko
  miko {green babel}
  miko {cyan start} {green babel}
  miko {cyan end}
  miko {cyan init}`,
      )
      .parse([...argv])
      .action((...args: $ReadOnlyArray<string>) => {
        resolve({ type: 'start', names: args.slice(0, -1) });
      });

    program
      .command('start')
      .description('trigger the start event to generate the files')
      .action((...args: $ReadOnlyArray<string>) => {
        resolve({ type: 'start', names: args.slice(0, -1) });
      });

    program
      .command('end')
      .description('trigger the end event to remove the files')
      .action(() => {
        resolve({ type: 'end' });
      });

    program
      .command('init')
      .description('initialize the scripts of the package.json')
      .action(() => {
        resolve({ type: 'init' });
      });

    if (argv.length !== 2) program.parse([...argv]);
    else resolve({ type: 'start', names: [] });
  });
