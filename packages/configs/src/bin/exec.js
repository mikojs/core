#! /usr/bin/env node
// @flow

import { cosmiconfigSync } from 'cosmiconfig';
import npmWhich from 'npm-which';
import execa from 'execa';
import chalk from 'chalk';
import debug from 'debug';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

import getExecCommands from 'exec/getCommands';

const logger = createLogger('@mikojs/configs (exec)');
const debugLog = debug('configs:bin:exec');

handleUnhandledRejection();

(async () => {
  const config = cosmiconfigSync('exec').search()?.config || {};
  const [type, ...argv] = process.argv.slice(2);
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

  try {
    for (const eachCommand of eachCommands)
      await execa(eachCommand[0], eachCommand.slice(1), {
        stdio: 'inherit',
      });
  } catch (e) {
    logger.log('Run command fail');
    debugLog(e);
    process.exit(e.exitCode || 1);
  }
})();
