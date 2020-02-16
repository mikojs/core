// @flow

import commander from 'commander';
import chalk from 'chalk';
import { emptyFunction } from 'fbjs';

import { createLogger } from '@mikojs/utils';

import { version } from '../../package.json';

import printInfo from './printInfo';
import validateCliName from './validateCliName';
import getOptions, { type optionType } from './getOptions';

import configs from 'utils/configs';

const logger = createLogger('@mikojs/configs');

/**
 * @example
 * cliOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {optionType} - cli options
 */
export default async (argv: $ReadOnlyArray<string>): Promise<optionType> =>
  new Promise((resolve, reject) => {
    const program = new commander.Command('configs')
      .version(version, '-v, --version')
      .arguments('<command-type> [commands...]')
      .usage(chalk`{green <command-type> [commands...]} {gray [options...]}`)
      .description(
        chalk`Example:
  configs {green babel -w}
  configs {green exec rawArgsFilteredrun custom command} {gray --configs-files babel,lint}
  configs {cyan info}
  configs {cyan info} {green babel}
  configs {cyan install} {green babel}
  configs {cyan remove} {green babel}`,
      )
      .option(
        '--configs-files [fileName...]',
        'use to generate the new config files which are not defined in the cli configs',
        // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
        (value: string) => value?.split(','),
      )
      .allowUnknownOption()
      .action(
        (
          cliName: string,
          _: mixed,
          options: {|
            configsFiles?: $ReadOnlyArray<string>,
            rawArgs: $ReadOnlyArray<string>,
            options: $ReadOnlyArray<{|
              short?: string,
              long: string,
            |}>,
          |},
        ) => {
          resolve(
            !validateCliName(logger, cliName)
              ? false
              : getOptions(logger, { ...options, cliName }),
          );
        },
      );

    program
      .command('info')
      .arguments('[command-type]')
      .usage(chalk`{green [command-type]}`)
      .description('print more info about configs')
      .action((cliName: ?string) => {
        resolve(printInfo(logger, cliName));
      });

    program
      .command('install')
      .arguments('<command-type>')
      .usage(chalk`{green <command-type>}`)
      .description('install packages by config')
      .action((cliName: string) => {
        resolve(
          !validateCliName(logger, cliName)
            ? false
            : {
                cli: 'install',
                argv: (
                  configs.get(cliName).install ||
                  emptyFunction.thatReturnsArgument
                )(['yarn', 'add', '--dev']),
                env: {},
                cliName,
              },
        );
      });

    program
      .command('remove')
      .arguments('<command-type>')
      .usage(chalk`{green <command-type>}`)
      .description('use to remove the generated files and the server')
      .action((cliName: string) => {
        resolve(
          !validateCliName(logger, cliName)
            ? false
            : {
                cli: 'remove',
                argv: [],
                env: {},
                cliName,
              },
        );
      });

    if (argv.length === 2) resolve(validateCliName(logger));
    else program.parse([...argv]);
  });
