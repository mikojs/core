// @flow

import fs from 'fs';

import chalk from 'chalk';

import logger from './logger';

export default async (projectDir: string) => {
  // check project dir not existing
  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);
  else
    throw logger.fail(
      chalk`The directory {green ${projectDir}} exists`,
      `Remove this directory or use a new name`,
    );
};
