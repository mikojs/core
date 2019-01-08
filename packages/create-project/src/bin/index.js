#! /usr/bin/env node
// @flow

import path from 'path';

import chalk from 'chalk';
import debug from 'debug';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import cliOptions from 'utils/cliOptions';
import validateProject from 'utils/validateProject';
import base from 'stores/base';
import type StoreType from 'stores';

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

  const storeNames = [];
  const stores = (await base.run(ctx)).filter(
    ({ constructor: { name } }: StoreType): boolean => {
      if (storeNames.includes(name)) return false;

      storeNames.push(name);
      return true;
    },
  );

  debug('create-project:bin')(stores);
  for (const store of stores) await store.end(ctx);
  await base.end(ctx);

  logger.succeed('Done');
})();
