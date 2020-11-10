#! /usr/bin/env node
// @flow

import path from 'path';

import ora from 'ora';
import chalk from 'chalk';
import debug from 'debug';
import execa from 'execa';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';
import buildWorker from '@mikojs/worker';

import getMikoOptions from 'utils/getMikoOptions';
import generateFiles from 'utils/generateFiles';
import { type commandsType } from 'utils/getCommands';
import getExecaArguments from 'utils/getExecaArguments';

import typeof * as workerType from 'worker';

const logger = createLogger('@mikojs/miko', ora({ discardStdin: false }));
const debugLog = debug('miko:bin');

handleUnhandledRejection();

(async () => {
  const {
    type,
    keep = false,
    getCommands,
    errorMessage,
  } = await getMikoOptions(process.argv);
  const worker = await buildWorker<workerType>(
    path.resolve(__dirname, '../worker/index.js'),
  );

  debugLog({ type, keep, getCommands });
  logger.start('Running');

  switch (type) {
    case 'error':
      if (errorMessage) logger.fail(errorMessage);

      process.exit(1);
      break;

    case 'kill':
      await worker.killAllEvents();
      logger.succeed('Done.');
      break;

    case 'command':
      await worker.addTracking(process.pid, generateFiles());

      const commands = getCommands?.() || [[]];

      debugLog(commands);
      logger.info(
        chalk`{gray Run command: ${commands
          .map((command: $ElementType<commandsType, number>) =>
            command.join(' '),
          )
          .join(' && ')}}`,
      );

      try {
        await commands.reduce(
          (
            result: Promise<void>,
            command: $ElementType<commandsType, number>,
          ) => result.then(() => execa(...getExecaArguments(command))),
          Promise.resolve(),
        );
      } catch (e) {
        debugLog(e);
        process.exit(e.code || 1);
      }
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

      await worker.addTracking(process.pid, generateFiles());

      if (!keep) logger.succeed('Done.');

      break;
  }
})();
