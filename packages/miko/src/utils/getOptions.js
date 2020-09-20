// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';
import { invariant } from 'fbjs';

import { version } from '../../package.json';

import getCommands, { type commandsType } from './getCommands';
import cache from './cache';

export type optionsType = {|
  type: 'error' | 'start' | 'kill' | 'command',
  configNames?: $ReadOnlyArray<string>,
  keep?: boolean,
  getCommands?: () => commandsType,
  errorMessage?: string,
|};

const debugLog = debug('miko:getOptions');

/**
 * @param {Array} argv - command line
 *
 * @return {optionsType} - options
 */
export default (argv: $ReadOnlyArray<string>): Promise<optionsType> =>
  new Promise(resolve => {
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

          if (
            configNames.some(
              (configName: string) => !cache.keys().includes(configName),
            )
          )
            resolve({
              type: 'error',
              errorMessage: chalk`Can not find {red ${configNames.join(
                ', ',
              )}} in the config`,
            });
          else resolve({ type: 'start', configNames, keep });
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
        !program.commands.some(({ _name }: { _name: string }) => _name === key),
        `Can not set the existing command: ${key}`,
      );
      program
        .command(key)
        .description(chalk`{gray (custom)} ${description}`)
        .allowUnknownOption()
        .action(
          ({
            parent: { rawArgs },
          }: {
            parent: { rawArgs: $ReadOnlyArray<string> },
          }) => {
            resolve({
              type: 'command',

              /**
               * @return {commandsType} - commands array
               */
              getCommands: () =>
                getCommands(command, configs, rawArgs.slice(3)),
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
