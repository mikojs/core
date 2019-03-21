#! /usr/bin/env node
// @flow

import path from 'path';

import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import cliOptions from 'utils/cliOptions';
import validateProject from 'utils/validateProject';
import base from 'stores/base';

handleUnhandledRejection();

(async () => {
  const ctx = cliOptions(process.argv);
  const { projectDir } = ctx;

  await validateProject(projectDir);

  logger.info(
    chalk`Creating a new project in {green ${path.relative(
      process.cwd(),
      projectDir,
    )}}`,
  );

  await base.init(ctx);

  logger.succeed('Done');
})();
