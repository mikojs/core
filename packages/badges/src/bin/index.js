#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import readPkgUp from 'read-pkg-up';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import badges from 'utils/badges';

handleUnhandledRejection();

(async (): Promise<void> => {
  const { path: pkgPath, pkg } = await readPkgUp();

  if (!pkgPath)
    logger.fail(
      'Can not find the root path',
      chalk`Create a {green package.json} first`,
    );

  const rootPath = path.dirname(pkgPath);
  const readmePath = path.resolve(rootPath, 'README.md');

  if (!fs.existsSync(readmePath))
    logger.fail(
      chalk`Can not find the {green README.md} in the root folder`,
      chalk`Create a {green README.md} first`,
    );

  const content = await badges(fs.readFileSync(readmePath, 'utf-8'), {
    rootPath,
    pkg,
  });

  // TODO
  const { log } = console;
  log(content);
})();
