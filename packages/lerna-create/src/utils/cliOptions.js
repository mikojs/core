// @flow

import path from 'path';

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../package.json';

import logger from './logger';

const debugLog = debug('lerna-create:cliOptions');

export default (argv: $ReadOnlyArray<string>): {} => {
  const program = new commander.Command('lerna-create')
    .version(version, '-v, --version')
    .arguments('<new project name>')
    .usage(chalk`{green <new project name>}`)
    .description(
      chalk`Example:
  lerna-create {green new-project}`,
    );

  const {
    args: [newProject],
  } = program.parse([...argv]);

  if (!newProject)
    logger.fail(
      chalk`Must give {green new project name}`,
      chalk`Use {green \`--help\`} to get the more information`,
    );

  const cliOptions = {
    newProject: path.resolve(newProject),
  };

  debugLog(cliOptions);

  return cliOptions;
};
