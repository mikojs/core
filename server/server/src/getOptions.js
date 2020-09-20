// @flow

import chalk from 'chalk';
import commander from 'commander';

import { version } from '../package.json';

/**
 * @param {string} cliName - cli name
 * @param {Array} argv - process argv
 *
 * @return {string} - folder path
 */
export default async (
  cliName: string,
  argv: $ReadOnlyArray<string>,
): Promise<string> =>
  new Promise(resolve =>
    new commander.Command(cliName)
      .version(version, '-v, --version')
      .arguments('<folderPath>')
      .description(
        chalk`Example:
  ${cliName} {green folderPath}`,
      )
      .action(resolve)
      .parse(argv),
  );
