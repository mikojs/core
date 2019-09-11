// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';
import npmWhich from 'npm-which';
import { emptyFunction } from 'fbjs';

import { mockChoice } from '@cat-org/utils';

import { version } from '../../package.json';

import logger from './logger';
import configs from './configs';

const debugLog = debug('configs:cliOptions');

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
): {|
  cli: string,
  argv: $ReadOnlyArray<string>,
  env: {},
  cliName: string,
  configsFiles: ?$ReadOnlyArray<string>,
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
  configs {green babel} {gray --configs-env envA,envB}
  configs {green execa run custom command} {gray --configs-env envA,envB --configs-files babel,lint}`,
    )
    .option('--install', 'install packages by config')
    .option('--info', 'print more info about configs')
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
    info = false,
    configsEnv,
    configsFiles,
  } = program.parse([...argv]);

  debugLog({
    cliName,
    rawArgs,
    shouldInstall,
    info,
    configsEnv,
    configsFiles,
  });

  if (configsEnv) configs.configsEnv = configsEnv;

  if (info) {
    if (cliName) {
      const config = configs.store[cliName];

      logger.info(
        `Show ${cliName} config`,
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
      );
    } else {
      const { log } = console;

      logger.info('Show configs list');
      log();
      Object.keys(configs.store).forEach((key: string) => {
        log(`  - ${key}`);
      });
      log();
    }

    mockChoice(
      process.env.NODE_ENV === 'test',
      () => {
        throw new Error('process exit');
      },
      process.exit,
    );
  }

  if (!cliName)
    throw logger.fail(
      chalk`Should give an argument at least`,
      chalk`Use {green \`-h\`} to get the more information`,
    );

  if (!configs.store[cliName])
    throw logger.fail(
      chalk`Can not find {cyan \`${cliName}\`} in configs`,
      chalk`Use {green \`--info\`} to get the more information`,
    );

  const {
    alias: cli = cliName,
    install = emptyFunction.thatReturnsArgument,
    run = emptyFunction.thatReturnsArgument,
    env = {},
  } = configs.store[cliName];

  try {
    const result = {
      cli: shouldInstall
        ? 'install'
        : cli === 'execa'
        ? 'execa'
        : npmWhich(process.cwd()).sync(cli),
      argv: shouldInstall
        ? install(['yarn', 'add', '--dev'])
        : run(rawArgs.filter((arg: string) => ![cliName].includes(arg))),
      env,
      cliName,
      configsFiles,
    };

    debugLog(result);

    return result;
  } catch (e) {
    if (/not found/.test(e.message))
      throw logger.fail(e.message.replace(/not found/, 'Not found cli'));

    throw e;
  }
};
