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
 * @return {{ cli: string, argv: Array<string>, env: object, cliName: string }} - cli options
 */
export default (
  argv: $ReadOnlyArray<string>,
):
  | boolean
  | {|
      cli: string,
      argv: $ReadOnlyArray<string>,
      env: {},
      cliName: string,
    |} => {
  const program = new commander.Command('configs')
    .version(version, '-v, --version')
    .arguments('[command type, arguments...]')
    .usage(chalk`{green [command type, arguments...]} {gray [options]}`)
    .description(
      chalk`Example:
  configs {green babel -w}
  configs {green babel:lerna -w}
  configs {gray --info}
  configs {green babel:lerna} {gray --info}
  configs {green babel:lerna} {gray --remove}
  configs {green babel} {gray --configs-env envA,envB}
  configs {green exec run custom command} {gray --configs-env envA,envB --configs-files babel,lint}`,
    )
    .option('--install', 'install packages by config')
    .option('--info', 'print more info about configs')
    .option('--remove', 'use to remove the generated files and the server')
    .option(
      '--configs-env [env]',
      'configs environment variables',
      // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
      (value: string) => value?.split(','),
    )
    .option(
      '--configs-files [fileName]',
      'use to generate the new config files which are not defined in the cli configs',
      // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
      (value: string) => value?.split(','),
    )
    .allowUnknownOption();

  const {
    args: [cliName],
    rawArgs,
    install: shouldInstall = false,
    remove: shouldRemove = false,
    info: showInfo = false,
    configsEnv,
    configsFiles,
    options,
  } = program.parse([...argv]);

  debugLog({
    cliName,
    rawArgs,
    shouldInstall,
    shouldRemove,
    showInfo,
    configsEnv,
    configsFiles,
  });

  if (configsEnv instanceof Array) configs.configsEnv = configsEnv;

  if (configs.store[cliName] && configsFiles instanceof Array)
    configsFiles.forEach((key: string) => {
      if (!configs.store[cliName].configFiles)
        configs.store[cliName].configFiles = {};

      configs.store[cliName].configFiles[key] = true;
    });

  if (showInfo) {
    const { info } = console;

    if (cliName) {
      const config = configs.store[cliName];

      if (!config) {
        logger
          .fail(chalk`Can not find {cyan \`${cliName}\`} in configs`)
          .fail(chalk`Use {green \`--info\`} to get the more information`);
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
                case 'ignore':
                case 'run':
                  return {
                    ...result,
                    // $FlowFixMe TODO: https://github.com/facebook/flow/issues/2645
                    [key]: config[key]([]),
                  };

                case 'config':
                  return {
                    ...result,
                    [key]: config[key]({}),
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
  }

  if (!cliName) {
    logger
      .fail(chalk`Should give an argument at least`)
      .fail(chalk`Use {green \`-h\`} to get the more information`);
    return false;
  }

  if (shouldInstall && shouldRemove) {
    logger.fail(
      chalk`Should not use {red \`--install\`} and {red \`remove\`} at the same time.`,
    );
    return false;
  }

  if (!configs.store[cliName]) {
    logger
      .fail(chalk`Can not find {cyan \`${cliName}\`} in configs`)
      .fail(chalk`Use {green \`--info\`} to get the more information`);
    return false;
  }

  const {
    alias: cli = cliName,
    getCli = (newArgs: $ReadOnlyArray<string>) =>
      npmWhich(process.cwd()).sync(cli),
    install = emptyFunction.thatReturnsArgument,
    run = emptyFunction.thatReturnsArgument,
    env = {},
  } = configs.store[cliName];

  try {
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
    const result = {
      cli: 'default',
      argv: ['default'],
      env,
      cliName,
    };

    if (shouldInstall) {
      result.cli = 'install';
      result.argv = install(['yarn', 'add', '--dev']);
    } else if (shouldRemove) {
      result.cli = 'remove';
      result.argv = [];
    } else {
      result.cli = getCli([cliName, ...rawArgsFiltered]);
      result.argv = run(rawArgsFiltered);
    }

    debugLog(result);

    return result;
  } catch (e) {
    if (/not found/.test(e.message)) {
      logger.fail(e.message.replace(/not found/, 'Not found cli'));
      return false;
    }

    throw e;
  }
};
