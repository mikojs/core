#! /usr/bin/env node
// @flow

import path from 'path';

import { handleUnhandledRejection } from '@mikojs/utils';
import buildWorker from '@mikojs/worker';

import getOptions from 'utils/getOptions';
import generateFiles from 'utils/generateFiles';
import removeFiles from 'utils/removeFiles';
import typeof * as workerType from 'utils/worker';

handleUnhandledRejection();

(async () => {
  const { type } = await getOptions(process.argv);
  const worker = await buildWorker<workerType>(
    path.resolve(__dirname, '../utils/worker'),
  );

  switch (type) {
    case 'end':
      if (await worker.removeTracking()) await removeFiles();
      break;

    case 'init':
      // TODO: initialize commands in package.json
      break;

    default:
      generateFiles();
      break;
  }
})();
