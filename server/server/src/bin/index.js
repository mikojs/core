#! /usr/bin/env node
// @flow

import path from 'path';
import readline from 'readline';
import tty from 'tty';

import execa, { type ThenableChildProcess as subprocessType } from 'execa';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';

handleUnhandledRejection();

const { log } = console;

/**
 * @example
 * printDivider()
 */
const printDivider = () => {
  if (process.stdout instanceof tty.WriteStream)
    log(
      chalk`{bold {gray ${[].constructor
        .apply({}, new Array(process.stdout.columns))
        .map(() => '-')
        .join('')}}}`,
    );
};

/**
 * @example
 * start('Restart')
 *
 * @param {string} type - `Restart` or `Start`
 *
 * @return {Object} execa subprocess
 */
const start = (type: string): subprocessType => {
  if (type === 'Restart') printDivider();

  logger.succeed(`${type} to run server`);
  logger.log(
    chalk`Enter {cyan \`exit\`} to stop server`,
    chalk`Enter {cyan \`restart\`} or {cyan \`rs\`} to restart server`,
  );
  log();

  return execa(path.resolve(__dirname, './run.js'), process.argv.slice(2), {
    stdout: 'inherit',
  });
};

(() => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let subprocess: subprocessType = start('Start');

  rl.on('SIGINT', () => {
    subprocess.kill();
    printDivider();
    logger.succeed('Stop server');
    rl.close();
  });

  rl.on('line', (input: string) => {
    switch (input) {
      case 'exit':
        subprocess.kill();
        printDivider();
        logger.succeed('Stop server');
        rl.close();
        break;

      case 'restart':
      case 'rs':
        subprocess.kill();
        subprocess = start('Restart');
        break;

      default:
        break;
    }
  });
})();
