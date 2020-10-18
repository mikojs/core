// @flow

import commander from 'commander';
import chalk from 'chalk';

import { type eventType } from '@mikojs/merge-dir/lib/utils/watcher';

import { version } from '../../package.json';

/**
 * @param {Array} argv - command line
 *
 * @return {eventType} - event type
 */
export default (argv: $ReadOnlyArray<string>): Promise<eventType | 'error'> =>
  new Promise(resolve => {
    const program = new commander.Command('server')
      .version(version, '-v, --version')
      .arguments('<type>')
      .description(
        chalk`Example:
  server {green dev}
  server {green build}
  server {green start}`,
      )
      .action((type: eventType) => {
        resolve(type);
      });

    if (argv.length !== 2) program.parse([...argv]);
    else {
      program.outputHelp();
      resolve('error');
    }
  });
