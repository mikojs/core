#! /usr/bin/env node
// @flow

import path from 'path';

import ora from 'ora';
import chalk from 'chalk';
import execa, { type ExecaPromise as execaPromiseType } from 'execa';
import debug from 'debug';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';
import buildWorker from '@mikojs/worker';

import getOptions from 'utils/getOptions';
import generateFiles from 'utils/generateFiles';

import typeof * as workerType from 'worker';

const logger = createLogger('@mikojs/miko', ora({ discardStdin: false }));
const debugLog = debug('miko:bin');

handleUnhandledRejection();

(async () => {
  const {
    type,
    configNames = [],
    keep = false,
    commands = [],
  } = await getOptions(process.argv);
  const worker = await buildWorker<workerType>(
    path.resolve(__dirname, '../worker/index.js'),
  );

  debugLog({ configNames, keep, commands });

  switch (type) {
    case 'kill':
      await worker.killAllEvents();
      break;

    case 'run': {
      const argvArray = await Promise.all(
        commands
          .slice(1)
          .map((command: $ReadOnlyArray<string>) =>
            execa(
              command[0],
              command.slice(1),
            ).then(({ stdout }: execaPromiseType) =>
              stdout.replace(/^'/, '').replace(/'$/, ''),
            ),
          ),
      );
      const finallyCommand = commands[0].map((command: string) =>
        command.replace(
          /\$([\d])+/,
          (_: string, indexString: string) =>
            argvArray[parseInt(indexString, 10) - 1],
        ),
      );

      debugLog({ argvArray, finallyCommand });

      await execa(finallyCommand[0], finallyCommand.slice(1), {
        stdout: 'inherit',
      });
      break;
    }

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
