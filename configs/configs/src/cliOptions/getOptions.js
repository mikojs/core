// @flow

import npmWhich from 'npm-which';
import debug from 'debug';
import { emptyFunction } from 'fbjs';

import { typeof createLogger as createLoggerType } from '@mikojs/utils';

import configs from 'utils/configs';

const debugLog = debug('configs:cliOptions:getOptions');

export type optionType =
  | boolean
  | {|
      cli: string,
      argv: $ReadOnlyArray<string>,
      env: {},
      cliName: string,
    |};

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
 * getOptions(logger, { cliName: 'cliName', ... })
 *
 * @param {createLoggerType} logger - logger functions
 * @param {object} options - the options from the commander
 *
 * @return {optionType} - cli options
 */
export default (
  logger: $Call<createLoggerType, string>,
  {
    cliName,
    configsFiles,
    rawArgs,
    options,
  }: {|
    cliName: string,
    configsFiles?: $ReadOnlyArray<string>,
    rawArgs: $ReadOnlyArray<string>,
    options: $ReadOnlyArray<{|
      short?: string,
      long: string,
    |}>,
  |},
): optionType => {
  configs.addConfigsFilesToConfig(cliName, configsFiles || []);

  const {
    alias: cli = cliName,
    run = emptyFunction.thatReturnsArgument,
    env = {},
  } = configs.get(cliName);
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

  debugLog({ rawArgsFiltered });

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

    return result;
  } catch (e) {
    if (!/not found/.test(e.message)) throw e;

    logger.fail(e.message.replace(/not found/, 'Not found cli'));

    return false;
  }
};
