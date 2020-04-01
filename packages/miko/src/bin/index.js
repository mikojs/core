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
  const { type, configNames = [] } = await getOptions(process.argv);
  const worker = await buildWorker<workerType>(
    path.resolve(__dirname, '../worker/index.js'),
  );

  switch (type) {
    case 'watch':
      logger.info(chalk`{gray Use ctrl + c to stop.}`);
      readline.createInterface({
        input: process.stdin,
      });
      await worker.addTracking(process.pid, generateFiles(configNames));
      break;

    case 'kill':
      await worker.killAllEvents();
      break;

    case 'init':
      // TODO: initialize commands in package.json
      break;

    default:
      await worker.addTracking(process.pid, generateFiles(configNames));
      break;
  }
})();
