#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

import cliOptions from 'utils/cliOptions';
import base from 'stores/base';

handleUnhandledRejection();

const logger = createLogger('@mikojs/create-project');

(async () => {
  const ctx = cliOptions(process.argv);

  if (!ctx) {
    process.exit(1);
    return;
  }

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
