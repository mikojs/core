// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../package.json';

export type optionsType = {|
  type: 'start' | 'kill' | 'run',
  configNames?: $ReadOnlyArray<string>,
  keep?: boolean,
  commands?: $ReadOnlyArray<string>,
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
  miko {gray --keep}
  miko {green babel}
  miko {green babel} {gray --keep}
  miko {cyan kill}
  miko {cyan run} {green 'babel src -d lib'}
  miko {cyan run} {green 'lerna exec "babel src -d lib $1" --stream' 'echo "-w"'}
  miko {cyan run} {green "lerna exec 'babel src -d lib \\$1' --stream" "echo '-w'"}`,
      )
      .option('--keep', 'use to keep server working, not auto close')
      .action(
        (
          configNames: $ReadOnlyArray<string>,
          { keep = false }: {| keep: boolean |},
        ) => {
          debugLog(configNames);
          resolve({ type: 'start', configNames, keep });
        },
      );

    program
      .command('kill')
      .description('kill the all events')
      .action(() => {
        resolve({ type: 'kill' });
      });

    program
      .command('run')
      .description('the helper to run the scripts in the package.json')
      .action((_: mixed, commands: $ReadOnlyArray<string>) => {
        resolve({
          type: 'run',
          commands,
        });
      });

    debugLog(argv);

    if (argv.length === 3 && argv.slice(-1)[0] === '--keep')
      resolve({ type: 'start', configNames: [], keep: true });
    else if (argv.length !== 2) program.parse([...argv]);
    else resolve({ type: 'start', configNames: [], keep: false });
  });
