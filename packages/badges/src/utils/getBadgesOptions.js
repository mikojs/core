// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../package.json';

const debugLog = debug('badges:getBadgesOptions');

/**
 * @param {Array} argv - command line
 *
 * @return {Array<string>} - badges options
 */
export default (
  argv: $ReadOnlyArray<string>,
): Promise<$ReadOnlyArray<string>> =>
  new Promise(resolve => {
    new commander.Command('badges')
      .version(version, '-v, --version')
      .arguments('<readme-paths...>')
      .description(chalk`add the badges to {green README.md}`)
      .action((readmePaths: $ReadOnlyArray<string>) => {
        debugLog(readmePaths);
        resolve(readmePaths);
      })
      .parse([...argv]);
  });
