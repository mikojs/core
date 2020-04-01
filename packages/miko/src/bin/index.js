#! /usr/bin/env node
// @flow

import path from 'path';
import readline from 'readline';

import chalk from 'chalk';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';
import buildWorker from '@mikojs/worker';

import getOptions from 'utils/getOptions';
import generateFiles from 'utils/generateFiles';

import typeof * as workerType from 'worker';

const logger = createLogger('@mikojs/miko');

handleUnhandledRejection();

(async () => {
  const { type, configNames = [], keep = false } = await getOptions(
    process.argv,
  );
  const worker = await buildWorker<workerType>(
    path.resolve(__dirname, '../worker/index.js'),
  );

  switch (type) {
    case 'kill':
      await worker.killAllEvents();
      break;

    case 'init':
      // TODO: initialize commands in package.json
      break;

    default:
      if (keep) {
        logger.info(chalk`{gray Use ctrl + c to stop.}`);
        readline.createInterface({
          input: process.stdin,
        });
      }

      await worker.addTracking(process.pid, generateFiles(configNames));
      break;
  }
})();
