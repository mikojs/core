// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';
import npmWhich from 'npm-which';
import { emptyFunction } from 'fbjs';

import { version } from '../../package.json';

import logger from './logger';
import configs from './configs';

const debugLog = debug('configs-scripts:cliOptions');

const program = new commander.Command('configs-scripts')
  .version(version, '-v, --version')
  .arguments('[command type, arguments...]')
  .usage(chalk`{green [command type, arguments...]} {gray [options]}`)
  .description(
    chalk`Example:
  configs-scripts {green babel -w}
  configs-scripts {green babel:lerna -w}
  configs-scripts {gray --info}
  configs-scripts {green babel:lerna} {gray --info}`,
  )
  .option('--install', 'install packages by config')
  .option('--npm', 'use npm to install packages')
  .option('--info', 'print more info about configs')
  .allowUnknownOption();

export default (
  argv: $ReadOnlyArray<string>,
): {
  cli: string,
  argv: $ReadOnlyArray<string>,
  env: {},
  cliName: string,
} => {
  const {
    args: [cliName],
    rawArgs,
    install: shouldInstall = false,
    npm: shouldUseNpm = false,
    info = false,
  } = program.parse([...argv]);

  debugLog({
    cliName,
    rawArgs,
    shouldInstall,
    shouldUseNpm,
    info,
  });

  if (info) {
    if (cliName) {
      const config = configs.store[cliName];

      if (typeof config === 'function')
        logger.info(`Show ${cliName} config`, config({}));
      else
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

    if (process.env.NODE_ENV === 'test') throw new Error('process exit');

    process.exit();
  }

  if (!cliName)
    logger.fail(
      chalk`Should give an argument at least`,
      chalk`Use {green \`-h\`} to get the more information`,
    );

  if (!configs.store[cliName])
    logger.fail(
      chalk`Can not find {cyan \`${cliName}\`} in configs`,
      chalk`Use {green \`--info\`} to get the more information`,
    );

  if (configs.customConfigsPath)
    logger.info(
      'Using external configsuration',
      `Location: ${configs.customConfigsPath}`,
    );

  const {
    alias: cli = cliName,
    install = emptyFunction.thatReturnsArgument,
    run = emptyFunction.thatReturnsArgument,
    env = {},
  } = configs.store[cliName];

  debugLog({
    cli,
    install: install([]),
    run: run([]),
    env,
  });

  try {
    return {
      cli: shouldInstall ? 'install' : npmWhich(process.cwd()).sync(cli),
      argv: shouldInstall
        ? install(
            shouldUseNpm ? ['npm', 'install', '-D'] : ['yarn', 'add', '--dev'],
          )
        : run(rawArgs.filter((arg: string) => ![cliName].includes(arg))),
      env,
      cliName,
    };
  } catch (e) {
    if (/not found/.test(e.message))
      logger.fail(e.message.replace(/not found/, 'Not found cli'));

    throw e;
  }
};
