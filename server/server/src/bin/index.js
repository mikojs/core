#! /usr/bin/env node
// @flow

import path from 'path';

import ora from 'ora';

import { createLogger } from '@mikojs/utils';

import buildApi from '../index';
import buildCli, { type loggerType } from '../buildCli';

(async () => {
  try {
    await buildCli(
      process.argv,
      path.resolve('./api'),
      createLogger('@mikojs/server', ora({ discardStdin: false })),
      (folderPath: string, logger: loggerType) =>
        buildApi(folderPath, {
          logger,
        }),
    );
  } catch (e) {
    process.exit(1);
  }
})();
