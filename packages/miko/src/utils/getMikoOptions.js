// @flow

import commander from 'commander';
import chalk from 'chalk';
import { invariant } from 'fbjs';

import { version } from '../../package.json';

import getCommands, { type commandsType } from './getCommands';
import cache from './cache';

export type mikoOptionsType = {|
  type: 'generate' | 'kill' | 'command',
  keep?: boolean,
  getCommands?: () => commandsType,
|};

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
      .description(
        chalk`{cyan manage configs} and {cyan run commands} with the {green miko} worker`,
      )
      .allowUnknownOption()
      .action((_: mixed, commands: $ReadOnlyArray<string>) => {
        resolve({
          type: 'command',

          /**
           * @return {commandsType} - commands array
           */
          getCommands: () => [commands],
        });
      });

    program
      .command('generate')
      .description('generate configs')
      .option('--keep', 'use to keep server working, not auto close')
      .action(({ keep = false }: {| keep: boolean |}) => {
        resolve({ type: 'generate', keep });
      });

    program
      .command('kill')
      .description(chalk`kill the all events of the {green miko} worker`)
      .action(() => {
        resolve({ type: 'kill' });
      });

    Object.keys(configs).forEach((key: string) => {
      const { command, description } = configs[key];

      invariant(
        !program.commands.some(({ _name }: { _name: string }) => _name === key),
        `Could not set the existing command: ${key}`,
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
