#! /usr/bin/env node
// @flow

import { cosmiconfigSync } from 'cosmiconfig';
import npmWhich from 'npm-which';
import execa from 'execa';
import chalk from 'chalk';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

import getExecCommands from 'utils/getExecCommands';

const logger = createLogger('@mikojs/configs (exec)');

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

  await execa(commands[0], commands.slice(1), {
    stdio: 'inherit',
  });
})();
