#! /usr/bin/env node
// @flow

import path from 'path';

import { handleUnhandledRejection } from '@mikojs/utils';
import buildWorker from '@mikojs/worker';

import getOptions from 'utils/getOptions';
import generateFiles from 'utils/generateFiles';

import typeof * as workerType from 'worker';

handleUnhandledRejection();

(async () => {
  const { type, configNames = [] } = await getOptions(process.argv);
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
      await worker.addTracking(process.pid, generateFiles(configNames));
      break;
  }
})();
