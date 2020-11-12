#! /usr/bin/env node
// @flow

import ora from 'ora';
import debug from 'debug';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

import parseArgv from 'utils/parseArgv';

const logger = createLogger('@mikojs/miko', ora({ discardStdin: false }));
const debugLog = debug('miko:bin');

handleUnhandledRejection();

(async () => {
  const result = await parseArgv(process.argv);

  debugLog(result);
  logger.start('Running');
})();
