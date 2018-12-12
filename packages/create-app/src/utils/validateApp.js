// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import execa from 'execa';
import debug from 'debug';

import logger from 'utils/logger';

const debugLog = debug('create-app:validateApp');

export default async (appDir: string): Promise<void> => {
  // check app dir not existing
  if (!fs.existsSync(appDir)) fs.mkdirSync(appDir);
  else
    logger.fail(
      chalk`The directory {green ${path.relative(
        process.cwd(),
        appDir,
      )}} exists`,
      `Remove this directory or use a new name`,
    );

  // not in git project
  try {
    await execa('git', ['status'], {
      cwd: appDir,
    });

    fs.rmdirSync(appDir);
    logger.fail('Can not create a new app on git managed project');
  } catch (e) {
    debugLog(e);
  }
};
