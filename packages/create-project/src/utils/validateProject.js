// @flow

import fs from 'fs';

import chalk from 'chalk';
import execa from 'execa';
import debug from 'debug';

import logger from './logger';

const debugLog = debug('create-project:validateProject');

export default async (projectDir: string) => {
  // check project dir not existing
  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);
  else
    throw logger.fail(
      chalk`The directory {green ${projectDir}} exists`,
      `Remove this directory or use a new name`,
    );

  // not in git project
  try {
    await execa.shell('git status', {
      cwd: projectDir,
    });

    fs.rmdirSync(projectDir);
    throw logger.fail('Can not create a new project in git managed project');
  } catch (e) {
    debugLog(e);

    if (
      !/fatal: not a git repository \(or any of the parent directories\): \.git/.test(
        e.stderr,
      )
    )
      throw logger.fail('Run git command fail');
  }
};
