// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';
import npmWhich from 'npm-which';
import { emptyFunction } from 'fbjs';

import { createLogger } from '@mikojs/utils';

import { version } from '../../package.json';

import configs from './configs';

const debugLog = debug('configs:cliOptions');
const logger = createLogger('@mikojs/configs');

/**
 * @example
 * printInfo('cliName')
 *
 * @param {string} cliName - cli name
 *
 * @return {boolean} - test result
 */
const printInfo = (cliName: ?string): boolean => {
  const { info } = console;

  if (cliName) {
    const config = configs.store[cliName];

    if (!config) {
      logger
        .fail(chalk`Can not find {cyan \`${cliName}\`} in configs`)
        .fail(chalk`Use {green \`info\`} to get the more information`);
      return false;
    }

    logger.info(
      chalk`Here is thie information of the {cyan ${cliName}} config:`,
    );
    info();
    info(
      JSON.stringify(
        (Object.keys(config): $ReadOnlyArray<string>).reduce(
          (result: {}, key: string): {} => {
            switch (key) {
              case 'install':
              case 'run':
                return {
                  ...result,
                  // $FlowFixMe TODO: https://github.com/facebook/flow/issues/2645
                  [key]: config[key]([]),
                };

              case 'config':
                return {
                  ...result,
                  // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
                  [key]: config[key]?.(configs.addConfigsEnv({})),
                };

              case 'ignore':
                return {
                  ...result,
                  // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
                  [key]: config[key]?.(),
                };

              default:
                return {
                  ...result,
                  [key]: config[key],
                };
            }
          },
          {},
        ),
        null,
        2,
      )
        .split(/\n/)
        .map((text: string) => `  ${text}`)
        .join('\n'),
    );
    info();
  } else {
    logger.info('Here are the all config names which you can use:');
    info();
    Object.keys(configs.store).forEach((key: string) => {
      info(`  - ${key}`);
    });
    info();
  }

  return true;
};

/**
 * @example
 * validateCliName('cliName')
 *
 * @param {string} cliName - cli name
 *
 * @return {boolean} - test result
 */
const validateCliName = (cliName: ?string): boolean => {
  if (!cliName) {
    logger
      .fail(chalk`Should give an argument at least`)
      .fail(chalk`Use {green \`-h\`} to get the more information`);
    return false;
  }

  if (!configs.store[cliName]) {
    logger
      .fail(chalk`Can not find {cyan \`${cliName}\`} in configs`)
      .fail(chalk`Use {green \`info\`} to get the more information`);
    return false;
  }

  return true;
};

/**
 * @example
 * fileOptions('--key', 'key', '--key')
 *
 * @param {string} optionKey - option key to test
 * @param {string} arg - current argument
 * @param {string} prevArg - prev argument
 *
 * @return {boolean} - test result
 */
const filterOptions = (optionKey: ?string, arg: string, prevArg: string) =>
  !optionKey
    ? false
    : optionKey === arg ||
      optionKey === prevArg ||
      new RegExp(`^${optionKey}=`).test(arg);

/**
 * @example
 * cliOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {Promise} - cli options
 */
export default async (
  argv: $ReadOnlyArray<string>,
): Promise<
  | boolean
  | {|
      cli: string,
      argv: $ReadOnlyArray<string>,
      env: {},
      cliName: string,
    |},
> =>
  new Promise((resolve, reject) => {
    const program = new commander.Command('configs')
      .version(version, '-v, --version')
      .arguments('<command-type> [commands...]')
      .usage(chalk`{green <command-type> [commands...]} {gray [options...]}`)
      .description(
        chalk`Example:
  configs {green babel -w}
  configs {green babel} {gray --configs-env envA,envB}
  configs {green exec rawArgsFilteredrun custom command} {gray --configs-env envA,envB --configs-files babel,lint}
  configs {cyan info}
  configs {cyan info} {green babel}
  configs {cyan install} {green babel}
  configs {cyan remove} {green babel}`,
      )
      .option(
        '--configs-env [env...]',
        'configs environment variables',
        // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
        (value: string) => value?.split(','),
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
          {
            configsEnv,
            configsFiles,
            rawArgs,
            options,
          }: {|
            configsEnv?: $ReadOnlyArray<string>,
            configsFiles?: $ReadOnlyArray<string>,
            rawArgs: $ReadOnlyArray<string>,
            options: $ReadOnlyArray<{|
              short?: string,
              long: string,
            |}>,
          |},
        ) => {
          if (!validateCliName(cliName)) resolve(false);
          else {
            if (configsEnv instanceof Array) configs.configsEnv = configsEnv;

            if (configs.store[cliName] && configsFiles instanceof Array)
              configsFiles.forEach((key: string) => {
                if (!configs.store[cliName].configsFiles)
                  configs.store[cliName].configsFiles = {};

                configs.store[cliName].configsFiles[key] = true;
              });

            const {
              alias: cli = cliName,
              run = emptyFunction.thatReturnsArgument,
              env = {},
            } = configs.store[cliName];
            const rawArgsFiltered = rawArgs
              .slice(2)
              .filter(
                (arg: string, index: number, allArgs: $ReadOnlyArray<string>) =>
                  arg !== cliName &&
                  !options.some(
                    ({ short, long }: {| short?: string, long: string |}) =>
                      filterOptions(short, arg, allArgs[index - 1]) ||
                      filterOptions(long, arg, allArgs[index - 1]),
                  ),
              );

            try {
              const result = {
                cli:
                  typeof cli !== 'function'
                    ? npmWhich(process.cwd()).sync(cli)
                    : cli([cliName, ...rawArgsFiltered]),
                argv: run(rawArgsFiltered),
                env,
                cliName,
              };

              debugLog(result);
              resolve(result);
            } catch (e) {
              if (!/not found/.test(e.message)) reject(e);
              else {
                logger.fail(e.message.replace(/not found/, 'Not found cli'));
                resolve(false);
              }
            }
          }
        },
      );

    program
      .command('info')
      .arguments('[command-type]')
      .usage(chalk`{green [command-type]}`)
      .description('print more info about configs')
      .action((cliName: ?string) => {
        resolve(printInfo(cliName));
      });

    program
      .command('install')
      .arguments('<command-type>')
      .usage(chalk`{green <command-type>}`)
      .description('install packages by config')
      .action((cliName: string) => {
        resolve(
          !validateCliName(cliName)
            ? false
            : {
                cli: 'install',
                argv: (
                  configs.store[cliName].install ||
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
          !validateCliName(cliName)
            ? false
            : {
                cli: 'remove',
                argv: [],
                env: {},
                cliName,
              },
        );
      });

    if (argv.length === 2) resolve(validateCliName());
    else program.parse([...argv]);
  });
