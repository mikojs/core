// @flow

import path from 'path';

import commander from 'commander';
import chalk from 'chalk';

import { createLogger } from '@mikojs/utils';

import { version } from '../../package.json';

const logger = createLogger('@mikojs/create-project');

/**
 * @example
 * cliOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {string} - project dir
 */
export default (argv: $ReadOnlyArray<string>) =>
  new Promise<?string>(resolve => {
    const program = new commander.Command('create-project')
      .version(version, '-v, --version')
      .arguments('<project-directory>')
      .usage(chalk`{green <project-directory>}`)
      .description(
        chalk`Example:
  create-project {green <project-directory>}`,
      )
      .action((projectDir: string) => {
        resolve(path.resolve(projectDir));
      });

    if (argv.length === 2) {
      logger.fail(chalk`{red \`project directory\`} is required`);
      resolve(null);
    } else program.parse([...argv]);
  });
