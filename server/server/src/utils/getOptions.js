// @flow

import commander from 'commander';
import chalk from 'chalk';

import { version } from '../../package.json';

export type optionsType = {|
  port: number,
  folderPath: string,
|};

/**
 * @example
 * getOptions([])
 *
 * @param {Array} argv - command line
 * @param {string} defaultFolder - default folder
 *
 * @return {optionsType} - options
 */
export default (
  argv: $ReadOnlyArray<string>,
  defaultFolder: string,
): Promise<optionsType> =>
  new Promise(resolve => {
    const defaultOptions = {
      port: 8000,
      folderPath: defaultFolder,
    };
    const program = new commander.Command('server')
      .version(version, '-v, --version')
      .arguments('[configNames...]')
      .description(
        chalk`Example:
  server
  server {gray -p port}
  server {gray -f .}`,
      )
      .option('-p, --port <port>', 'server port')
      .option(
        '-f, --folder-path <path>',
        'the folder path to use build middleware',
      )
      .action(
        (
          _: mixed,
          { port, folderPath }: {| port: string, folderPath: string |},
        ) => {
          resolve({
            port: !port ? defaultOptions.port : parseInt(port, 10),
            folderPath: !folderPath ? defaultOptions.folderPath : folderPath,
          });
        },
      );

    if (argv.length !== 2) program.parse([...argv]);
    else resolve(defaultOptions);
  });