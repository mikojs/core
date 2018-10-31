// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../../package.json';

import logger from 'utils/logger';
import configs from 'utils/configs';

const debugLog = debug('configs-scripts:cliOptions');

const program = new commander.Command('configs-scripts')
  .version(version, '-v, --version')
  .arguments('[command type, arguments...]')
  .usage(chalk`{green [command type, arguments...]} {gray [options]}`)
  .description(
    chalk`Example:
  configs-scripts {green babel -w}
  configs-scripts {green babel:lerna -w}
  configs-scripts {green babel:lerna} {gray --info}`,
  )
  .option('--install', 'install packages by config')
  .option('--npm', 'use npm to install packages')
  .option('--info', 'print more info about configs')
  .allowUnknownOption();

const {
  args: [cliName],
  rawArgs,
  install: shouldInstall = false,
  npm: shouldUseNpm = false,
  info = false,
} = program.parse(process.argv);

debugLog({
  cliName,
  rawArgs,
  shouldInstall,
  shouldUseNpm,
  info,
});

if (info) {
  /**
   * Handle data
   *
   * @example
   * handleData({})
   *
   * @param {Object | Array<string>} data - data to handle
   *
   * @return {string} - return data string
   */
  const handleData = (data: {} | $ReadOnlyArray<string>): string =>
    JSON.stringify(data, null, 2);

  /**
   * Get data
   *
   * @example
   * getData('command', 'content')
   *
   * @param {string} key - the key of the data
   * @param {string} content - data
   *
   * @return {string} - data string
   */
  const getData = (key: string, content: string): string =>
    chalk`{bold {cyan ${key}}} = ${content}`;

  program.outputHelp(
    (): string =>
      (Object.keys(
        cliName ? { [cliName]: configs.store[cliName] } : configs.store,
      ): $ReadOnlyArray<string>)
        .reduce((result: $ReadOnlyArray<string>, key: string): $ReadOnlyArray<
          string,
        > => {
          const {
            alias,
            install,
            config,
            ignore,
            ignoreName,
            run,
            env = {},
            configFiles = {},
            ...data
          } = configs.store[key];

          if (!config)
            return [
              ...result,
              chalk`{underline {bold {green ${key}}}}

{bold {cyan config}} = ${handleData(configs.store[key]({}))}`,
            ];

          if (Object.keys(data).length !== 0)
            logger.warn(
              chalk`{cyan \`${Object.keys(data).join(
                '` ,`',
              )}\`} should not be in {green ${key}} config`,
            );

          return [
            ...result,
            chalk`{underline {bold {green ${key}}}}

${[
              getData('command', `"${run?.([alias || key]).join(' ') || key}"`),
              !install ? false : getData('install', handleData(install([]))),
              getData('config', handleData(config({}))),
              !ignore ? false : getData('ignore', handleData(ignore())),
              !ignoreName ? false : getData('ignoreName', ignoreName),
              Object.keys(env).length === 0
                ? false
                : getData('env', handleData(env)),
              Object.keys(configFiles).length === 0
                ? false
                : getData('configFiles', handleData(configFiles)),
            ]
              .filter((text: string | false): boolean => !!text)
              .join('\n')}`,
          ];
        }, [])
        .join('\n\n') + '\n',
  );
  process.exit();
}

if (!cliName)
  logger.fail(
    chalk`Should give an argument at least`,
    chalk`Use {green \`-h\`} to get the more information`,
  );

export default {
  cliName,
  argv: rawArgs.filter((arg: string): boolean => ![cliName].includes(arg)),
  shouldInstall,
  shouldUseNpm,
};
