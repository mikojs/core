#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import cliOptions from 'utils/cliOptions';
import base from 'stores/base';

handleUnhandledRejection();

(async () => {
  const ctx = cliOptions(process.argv);
  const { projectDir } = ctx;

  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);

  logger.info(
    chalk`Creating a new project in {green ${path.relative(
      process.cwd(),
      projectDir,
    ) || './'}}`,
  );

  await base.init(ctx);

  logger.succeed('Done');
})();
