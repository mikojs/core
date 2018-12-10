// @flow

import fs from 'fs';
import path from 'path';

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';
import npmWhich from 'npm-which';

import { version } from '../../package.json';

import logger from './logger';

const debugLog = debug('lerna-create:cliOptions');

export default (
  argv: $ReadOnlyArray<string>,
): ?{
  newProject: string,
  rootPath: string,
  workspaces: $ReadOnlyArray<string>,
} => {
  const program = new commander.Command('lerna-create')
    .version(version, '-v, --version')
    .arguments('<new project name>')
    .usage(chalk`{green <new project name>}`)
    .description(
      chalk`Example:
  lerna-create {green new-project}`,
    );

  const {
    args: [relativeNewProject],
  } = program.parse([...argv]);

  if (!relativeNewProject)
    logger.fail(
      chalk`Must give {green new project name}`,
      chalk`Use {green \`--help\`} to get the more information`,
    );

  const newProject = path.resolve(relativeNewProject);

  if (fs.existsSync(newProject))
    logger.fail(
      chalk`Project exits: {red ${path.relative(process.cwd(), newProject)}}`,
    );

  try {
    const rootPath = path.resolve(
      npmWhich(process.cwd()).sync('lerna'),
      '../../..',
    );
    const { workspaces = [] } = require(path.resolve(rootPath, 'package.json'));

    if (workspaces.length === 0)
      logger.fail(
        chalk`Can not find the workspcaes in the {cyan package.json}`,
      );

    const cliOptions = {
      newProject,
      rootPath,
      workspaces,
    };

    debugLog(cliOptions);

    return cliOptions;
  } catch (e) {
    logger.fail(chalk`Can not find {red lerna} in the project`);

    return null;
  }
};
