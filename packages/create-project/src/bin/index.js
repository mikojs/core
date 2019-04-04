#! /usr/bin/env node
// @flow

import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import cliOptions from 'utils/cliOptions';
import validateProject from 'utils/validateProject';
import base from 'stores/base';

handleUnhandledRejection();

(async () => {
  const ctx = cliOptions(process.argv);

  await validateProject(ctx);

  if (ctx.check)
    logger.info(
      chalk`Checking a existing project in {green ${ctx.projectDir}}`,
    );
  else logger.info(chalk`Creating a new project in {green ${ctx.projectDir}}`);

  await base.init(ctx);

  logger.succeed('Done');
})();
