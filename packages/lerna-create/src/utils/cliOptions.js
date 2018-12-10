// @flow

import path from 'path';

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../package.json';

import logger from './logger';

const debugLog = debug('lerna-create:cliOptions');

export default (
  argv: $ReadOnlyArray<string>,
): {
  existingProject: string,
  newProject: string,
} => {
  const program = new commander.Command('lerna-create')
    .version(version, '-v, --version')
    .arguments('<existing project, new project>')
    .usage(chalk`{green <existing project, new project>}`)
    .description(
      chalk`Example:
  lerna-create {green existing-project new-project}`,
    );

  const {
    args: [existingProject, newProject],
  } = program.parse([...argv]);
  const cliOptions = {
    existingProject: path.resolve(existingProject),
    newProject: path.resolve(newProject),
  };

  if (!existingProject || !newProject)
    logger.fail(
      chalk`Must give {green existing project} and {green new project}`,
      chalk`Use {green \`--info\`} to get the more information`,
    );

  debugLog(cliOptions);

  return cliOptions;
};
