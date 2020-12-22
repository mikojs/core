#! /usr/bin/env node
// @flow

import path from 'path';

import debug from 'debug';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';
import buildWorker from '@mikojs/worker';
import createLogger from '@mikojs/logger';

import configsCache from 'utils/configsCache';
import parseArgv from 'utils/parseArgv';
import generateFiles from 'utils/generateFiles';

import typeof * as workerType from 'worker';
import commands from 'commands';

const logger = createLogger('@mikojs/miko');
const debugLog = debug('miko:bin');

handleUnhandledRejection();

(async () => {
  const configs = configsCache.get('miko').config?.({}) || {};
  const [type, { keep = false }, rawArgs = []] = await parseArgv(
    configs,
    process.argv,
  );
  const worker = await buildWorker<workerType>(
    path.resolve(__dirname, '../worker/index.js'),
  );

  debugLog({ type, keep, rawArgs });
  logger.start('Running');

  switch (type) {
    case 'kill':
      await worker.killAllEvents();
      logger.success('Done.');
      break;

    case 'generate':
      await worker.addTracking(process.pid, generateFiles());

      if (!keep) logger.success('Done.');
      else {
        let count: number = 0;

        logger.info(chalk`{gray Use ctrl + c to stop.}`);
        setInterval(() => {
          logger.start(
            `Running${[].constructor
              .apply({}, new Array(count))
              .fill('.')
              .join('')}`,
          );
          count = count + 1 > 3 ? 0 : count + 1;
        }, 500);
      }
      break;

    default:
      const { info, run } = commands(
        configs,
        typeof type === 'string' ? type : [type],
        rawArgs,
      );

      await worker.addTracking(process.pid, generateFiles());
      logger.info(chalk`{gray Run command: ${info}}`);
      logger.stop();

      try {
        await run();
      } catch (e) {
        debugLog(e);
        process.exit(1);
      }
      break;
  }
})();
