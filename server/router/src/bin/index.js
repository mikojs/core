#! /usr/bin/env node
// @flow

import path from 'path';

import { handleUnhandledRejection } from '@mikojs/utils';
import runServer from '@mikojs/server/lib/runServer';

import router from '../index';

import getRouterOptions from 'utils/getRouterOptions';

handleUnhandledRejection();

(async () => {
  const { event, folderPath, port } = await getRouterOptions(process.argv);
  const { error } = console;

  if (event !== 'error') {
    await runServer(event, port, router(path.resolve(folderPath)));
    return;
  }

  error(`error: missing required argument 'event'`);
  process.exit(1);
})();
