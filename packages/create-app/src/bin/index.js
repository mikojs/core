#! /usr/bin/env node
// @flow

import path from 'path';

import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import cliOptions from 'utils/cliOptions';
import validateApp from 'utils/validateApp';
import base from 'stores/base';

import type StoreType from 'stores';

handleUnhandledRejection();

(async (): Promise<void> => {
  const { appDir } = cliOptions(process.argv);

  await validateApp(appDir);

  logger.info(
    chalk`Creating a new app in {green ${path.relative(
      process.cwd(),
      appDir,
    )}}`,
  );

  const storeNames = [];
  const ctx = { appDir };
  const stores = (await base.run(ctx)).filter(
    ({ constructor: { name } }: StoreType): boolean => {
      if (storeNames.includes(name)) return false;

      storeNames.push(name);
      return true;
    },
  );

  for (const store of stores) await store.end(ctx);

  logger.succeed('Done');
})();
