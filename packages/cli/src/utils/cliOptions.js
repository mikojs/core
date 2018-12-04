// @flow

import path from 'path';

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../package.json';

import logger from './logger';

/**
 * @example
 * resolveAction('name', resolve)
 *
 * @param {string} callbackName - callback name in cli folder
 * @param {Function} resolve - promise resolve function
 *
 * @return {Function} - action function
 */
export const resolveAction = (
  callbackName: string,
  resolve: () => void,
) => async (...args: $ReadOnlyArray<string>): Promise<void> => {
  debug('cli:cliOptions')(callbackName);
  await require(path.resolve(__dirname, '../cli', callbackName))(...args);
  resolve();
};

export default (argv: $ReadOnlyArray<string>): {} =>
  new Promise(resolve => {
    if (argv.length <= 2)
      logger.fail(
        chalk`Running {red cli} with {red command} is needed`,
        chalk`Use {cyan -h} to find the more information`,
      );

    const program = new commander.Command('cli')
      .version(version, '-v, --version')
      .usage(chalk`{green <command>} {gray [options]}`);

    program
      .command('lerna-create <name>')
      .usage(chalk`{green <name>} {gray [options]}`)
      .description(
        chalk`create a {green new project} in a {cyan lerna} repo from the other lerna-managed project`,
      )
      .option(
        '-b, --base <path>',
        'the path of the lerna-managed project is used to copy',
      )
      .action(resolveAction('lernaCreate', resolve));

    program.parse([...argv]);
  });
