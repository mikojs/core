#! /usr/bin/env node
// @flow

import execa from 'execa';
import chalk from 'chalk';
import debug from 'debug';

import {
  handleUnhandledRejection,
  createLogger,
  findRootProcess,
} from '@mikojs/utils';

import cliOptions from 'utils/cliOptions';

const logger = createLogger('@mikojs/configs (exec)');
const debugLog = debug('configs-exec:bin');

handleUnhandledRejection();

(async () => {
  try {
    const commands = await cliOptions(process.argv);

    debugLog(commands);

    if (!commands) throw new Error('commands are required');

    if (commands === true) return;

    logger.log(chalk`Run command: {gray ${commands.join(' ')}}`);
    await commands
      .reduce(
        (result: $ReadOnlyArray<$ReadOnlyArray<string>>, command: string) =>
          command === '&&'
            ? [...result, []]
            : [...result.slice(0, -1), [...result[result.length - 1], command]],
        [[]],
      )
      .reduce(
        (result: Promise<void>, command: $ReadOnlyArray<string>) =>
          result.then(() =>
            execa(command[0], command.slice(1), {
              stdio: 'inherit',
            }),
          ),
        Promise.resolve(),
      );
  } catch (e) {
    if (/not found/.test(e.message)) throw e;

    const rootProcess = await findRootProcess(__filename);

    if (rootProcess?.pid === process.pid)
      logger.log(
        chalk`Run command fail, you can use {green exec info} to find the more commands`,
      );

    debugLog(e);
    process.exit(e.exitCode || 1);
  }
})();
