#! /usr/bin/env node
// @flow

import path from 'path';

import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/utils';

import runStores from './runStores';

import logger from 'utils/logger';
import cliOptions from 'utils/cliOptions';
import validateProject from 'utils/validateProject';

handleUnhandledRejection();

(async (): Promise<void> => {
  const ctx = cliOptions(process.argv);
  const { projectDir } = ctx;

  await validateProject(projectDir);

  logger.info(
    chalk`Creating a new project in {green ${path.relative(
      process.cwd(),
      projectDir,
    )}}`,
  );

  await runStores(ctx);

  logger.succeed('Done');
})();
