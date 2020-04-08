#! /usr/bin/env node
// @flow

import path from 'path';

import ora from 'ora';
import chalk from 'chalk';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';
import buildWorker from '@mikojs/worker';

import getOptions from 'utils/getOptions';
import generateFiles from 'utils/generateFiles';

import typeof * as workerType from 'worker';

const logger = createLogger('@mikojs/miko', ora({ discardStdin: false }));

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

    default:
      if (keep) {
        let count: number = 0;

        logger.info(chalk`{gray Use ctrl + c to stop.}`);
        setInterval(() => {
          logger.start(
            `Running${[].constructor
              .apply({}, new Array(count))
              .map(() => '.')
              .join('')}`,
          );
          count = count + 1 > 3 ? 0 : count + 1;
        }, 500);
      }

      await worker.addTracking(process.pid, generateFiles(configNames));
      break;
  }
})();
