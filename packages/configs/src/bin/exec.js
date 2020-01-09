#! /usr/bin/env node
// @flow

import { cosmiconfigSync } from 'cosmiconfig';
import npmWhich from 'npm-which';
import execa from 'execa';
import chalk from 'chalk';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

const logger = createLogger('@mikojs/configs (exec)');

handleUnhandledRejection();

/**
 * @example
 * getCommands(['lerna', 'babel'], {})
 *
 * @param {Array} keys - commands keys
 * @param {object} prevConfig - prev config
 *
 * @return {Array} - commands
 */
const getCommands = (
  [key, ...otherKeys]: $ReadOnlyArray<string>,
  prevConfig: {},
): ?$ReadOnlyArray<string> => {
  if (!prevConfig[key]) return null;

  if (otherKeys.length === 0) return prevConfig[key];

  return getCommands(otherKeys, prevConfig[key]);
};

(async () => {
  const config = cosmiconfigSync('exec').search()?.config || {};
  const [type, ...argv] = process.argv.slice(2);
  const commands = [
    ...(getCommands(type.split(/:/), config) || [
      npmWhich(process.cwd()).sync(type),
    ]),
    ...argv,
  ];

  logger.log(chalk`Run command: {gray ${commands.join(' ')}}`);

  await execa(commands[0], commands.slice(1), {
    stdio: 'inherit',
  });
})();
