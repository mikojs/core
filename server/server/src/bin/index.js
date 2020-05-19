#! /usr/bin/env node
// @flow

import path from 'path';

import ora from 'ora';
import debug from 'debug';

import { createLogger } from '@mikojs/utils';

import buildApi from '../index';
import buildCli from '../buildCli';

const logger = createLogger('@mikojs/server', ora({ discardStdin: false }));
const debugLog = debug('server:bin');

(async () => {
  try {
    await buildCli(
      process.argv,
      path.resolve('./api'),
      logger,
      (folderPath: string) =>
        buildApi(folderPath, {
          dev: process.env.NODE_ENV !== 'production',
          logger,
        }),
    );
  } catch (e) {
    debugLog(e);
    logger.fail(e.message);
    process.exit(1);
  }
})();
