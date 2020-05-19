#! /usr/bin/env node
// @flow

import path from 'path';

import ora from 'ora';
import debug from 'debug';

import { createLogger } from '@mikojs/utils';
import buildCli from '@mikojs/server/lib/buildCli';

import buildGraphql from '../index';

const logger = createLogger('@mikojs/graphql', ora({ discardStdin: false }));
const debugLog = debug('graphql:bin');

(async () => {
  try {
    await buildCli(
      process.argv,
      path.resolve('./graphql'),
      logger,
      (folderPath: string) =>
        buildGraphql(folderPath, {
          dev: process.env.NODE_ENV === 'production',
          logger,
        }),
    );
  } catch (e) {
    debugLog(e);
    logger.fail(e.message);
    process.exit(1);
  }
})();
