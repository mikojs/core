#! /usr/bin/env node
// @flow

import { cosmiconfigSync } from 'cosmiconfig';
import npmWhich from 'npm-which';
import execa from 'execa';
import chalk from 'chalk';
import debug from 'debug';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

import printInfo from 'exec/printInfo';
import getExecCommands from 'exec/getCommands';

const logger = createLogger('@mikojs/configs (exec)');
const debugLog = debug('configs:bin:exec');

handleUnhandledRejection();

(async () => {
  const config = cosmiconfigSync('exec').search()?.config || {};

  try {
    const [type, ...argv] = process.argv.slice(2);

    if (type === 'info') {
      const { log } = console;

      logger.info('Here are the all commands which you can use:');
      log();
      printInfo(config);
      log();
      return;
    }

    const commands = [
      ...(getExecCommands(type.split(/:/), config) || [
        npmWhich(process.cwd()).sync(type),
      ]),
      ...argv,
    ];

    logger.log(chalk`Run command: {gray ${commands.join(' ')}}`);
    debugLog({ type, argv, config });

    const eachCommands = commands.reduce(
      (result: $ReadOnlyArray<$ReadOnlyArray<string>>, command: string) =>
        command === '&&'
          ? [...result, []]
          : [...result.slice(0, -1), [...result[result.length - 1], command]],
      [[]],
    );

    for (const eachCommand of eachCommands)
      await execa(eachCommand[0], eachCommand.slice(1), {
        stdio: 'inherit',
      });
  } catch (e) {
    logger.log(
      chalk`Run command fail, you can use {green exec info} to find the more commands`,
    );
    debugLog(e);
    process.exit(e.exitCode || 1);
  }
})();
