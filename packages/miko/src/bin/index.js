#! /usr/bin/env node
// @flow

import path from 'path';

import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';
import buildWorker from '@mikojs/worker';
import createLogger from '@mikojs/logger';

import configsCache from 'utils/configsCache';
import parseArgv from 'utils/parseArgv';
import generateFiles from 'utils/generateFiles';

import refactorGenerateFiles from 'refactor/generateFiles';

import typeof * as workerType from 'worker';
import commands from 'commands';

const logger = createLogger('@mikojs/miko:bin');

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

  logger.debug({ type, keep, rawArgs });
  refactorGenerateFiles();

  switch (type) {
    case 'kill':
      await worker.killAllEvents();
      logger.success('Successfully killed the server.');
      break;

    case 'generate':
      await worker.addTracking(process.pid, generateFiles());

      if (!keep) logger.success('Successfully generated the files.');
      else {
        logger.info(chalk`Use {green ctrl + c} to stop.`);
        logger.start('Server is running.');
      }
      break;

    default:
      const { info, run } = commands(
        configs,
        typeof type === 'string' ? type : [type],
        rawArgs,
      );

      await worker.addTracking(process.pid, generateFiles());
      logger.info(chalk`Run command: {gray ${info}}.`);

      try {
        await run();
      } catch (e) {
        logger.debug(e);
        process.exit(1);
      }
      break;
  }
})();
