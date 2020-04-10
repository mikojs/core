// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';
import { invariant } from 'fbjs';

import { version } from '../../package.json';

import getCommand from './getCommand';

import cache from './cache';

export type optionsType = {|
  type: 'start' | 'kill' | 'command',
  configNames?: $ReadOnlyArray<string>,
  keep?: boolean,
  otherArgs?: $ReadOnlyArray<string>,
  getCommand?: () => $ReadOnlyArray<$ReadOnlyArray<string>>,
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
    const configs = cache.get('miko').config?.({}) || {};
    const program = new commander.Command('miko')
      .version(version, '-v, --version')
      .arguments('[configNames...]')
      .description(
        chalk`Example:
  miko
  miko {gray --keep}
  miko {green babel}
  miko {green babel} {gray --keep}
  miko {cyan kill}`,
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

    Object.keys(configs).forEach((key: string) => {
      const { command, description } = configs[key];

      invariant(
        !['kill'].includes(key),
        `Can not set the existing command: ${key}`,
      );
      program
        .command(key)
        .description(description)
        .allowUnknownOption()
        .action(
          ({
            parent: { rawArgs },
          }: {
            parent: { rawArgs: $ReadOnlyArray<string> },
          }) => {
            resolve({
              type: 'command',
              otherArgs: rawArgs.slice(3),
              getCommand:
                typeof command === 'string'
                  ? () => getCommand(command)
                  : command,
            });
          },
        );
    });

    debugLog(argv);

    if (argv.length === 3 && argv.slice(-1)[0] === '--keep')
      resolve({ type: 'start', configNames: [], keep: true });
    else if (argv.length !== 2) program.parse([...argv]);
    else resolve({ type: 'start', configNames: [], keep: false });
  });
