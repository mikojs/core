// @flow

import commander from 'commander';
import chalk from 'chalk';

import { type eventType } from '@mikojs/server';

import { version } from '../../package.json';

export type routerOptionsType = {|
  event: eventType | 'error',
  folderPath: string,
  port: number,
|};

/**
 * @param {Array} argv - command line
 *
 * @return {routerOptionsType} - router options
 */
export default (argv: $ReadOnlyArray<string>): Promise<routerOptionsType> =>
  new Promise(resolve => {
    const program = new commander.Command('router')
      .version(version, '-v, --version')
      .arguments('<event> <folderPath>')
      .description(
        chalk`Example:
  router {green dev folderPath}
  router {green build folderPath}
  router {green start folderPath}`,
      )
      .option('-p, --port <port>', 'the port of the server')
      .action(
        (
          event: eventType,
          folderPath: string,
          { port = 3000 }: {| port: number |},
        ) => {
          resolve({
            event,
            folderPath,
            port,
          });
        },
      );

    if (argv.length !== 2) program.parse([...argv]);
    else resolve({ event: 'error', folderPath: __dirname, port: 3000 });
  });
