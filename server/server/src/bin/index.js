#! /usr/bin/env node
// @flow

import path from 'path';

import ora from 'ora';

import { createLogger } from '@mikojs/utils';

import buildApi, { type optionsType } from '../index';
import buildCli from '../buildCli';

(async () => {
  try {
    await buildCli(
      process.argv,
      path.resolve('./api'),
      createLogger('@mikojs/server', ora({ discardStdin: false })),
      (folderPath: string, logger: $PropertyType<optionsType, 'logger'>) =>
        buildApi(folderPath, {
          dev: process.env.NODE_ENV !== 'production',
          logger,
        }),
    );
  } catch (e) {
    process.exit(1);
  }
})();
