// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';
import { invariant } from 'fbjs';

import { version } from '../../package.json';

import getCommands, { type commandsType } from './getCommands';
import cache from './cache';

export type mikoOptionsType = {|
  type: 'error' | 'start' | 'kill' | 'command',
  configNames?: $ReadOnlyArray<string>,
  keep?: boolean,
  getCommands?: () => commandsType,
  errorMessage?: string,
|};

const debugLog = debug('miko:getMikoOptions');

/**
 * @param {Array} argv - command line
 *
 * @return {mikoOptionsType} - miko options
 */
export default (argv: $ReadOnlyArray<string>): Promise<mikoOptionsType> =>
  new Promise(resolve => {
    const configs = cache.get('miko').config?.({}) || {};
    const program = new commander.Command('miko')
      .version(version, '-v, --version')
      .arguments('[config-names...]')
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

    program.parse([...argv]);
  });
