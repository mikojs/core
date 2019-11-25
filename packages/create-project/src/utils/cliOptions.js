// @flow

import path from 'path';

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { createLogger } from '@mikojs/utils';

import { version } from '../../package.json';

import type StoresType from 'stores';

const debugLog = debug('create-project:cliOptions');
const logger = createLogger('@mikojs/create-project');

/**
 * @example
 * cliOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {StoresType.ctx} - store context
 */
export default (
  argv: $ReadOnlyArray<string>,
): ?$PropertyType<StoresType, 'ctx'> => {
  const {
    args: [projectDir],
    lerna,
    skipCommand,
    verbose,
  } = new commander.Command('create-project')
    .version(version, '-v, --version')
    .arguments('<project-directory>')
    .usage(chalk`{green <project-directory>}`)
    .description(
      chalk`Example:
  create-project {green <project-directory>}`,
    )
    .option('--lerna', 'create package in the lerna-managed repo', false)
    .option('--skip-command', 'skip running commands', false)
    .option('--verbose', 'log everything', false)
    .parse([...argv]);

  if (!projectDir) {
    logger.fail(chalk`{red \`project directory\`} is required`);
    return null;
  }

  const cliOptions = {
    projectDir: path.resolve(projectDir),
    skipCommand,
    lerna,
    verbose,
  };

  debugLog(cliOptions);

  return cliOptions;
};
