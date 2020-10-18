// @flow

import commander from 'commander';
import chalk from 'chalk';

import { type eventType } from '@mikojs/merge-dir/lib/utils/watcher';

import { version } from '../../package.json';

export type serverOptionsType = {|
  event: eventType | 'error',
  filePath: string,
|};

/**
 * @param {Array} argv - command line
 *
 * @return {serverOptionsType} - server options
 */
export default (argv: $ReadOnlyArray<string>): Promise<serverOptionsType> =>
  new Promise(resolve => {
    const program = new commander.Command('server')
      .version(version, '-v, --version')
      .arguments('<event>')
      .description(
        chalk`Example:
  server {green dev}
  server {green build}
  server {green start}`,
      )
      .option('-f, --file-path <filePath>', 'the path of the folder')
      .action(
        (
          event: eventType,
          { filePath = process.cwd() }: {| filePath: string |},
        ) => {
          resolve({
            event,
            filePath,
          });
        },
      );

    if (argv.length !== 2) program.parse([...argv]);
    else resolve({ event: 'error', filePath: process.cwd() });
  });
