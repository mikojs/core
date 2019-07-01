#! /usr/bin/env node
// @flow

import path from 'path';

import execa from 'execa';
import debug from 'debug';
import isRunning from 'is-running';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/utils';

import configs from 'utils/configs';
import cliOptions from 'utils/cliOptions';
import generateFiles from 'utils/generateFiles';
import worker from 'utils/worker';
import logger from 'utils/logger';

const { cli, argv, env, cliName } = cliOptions(process.argv);
const debugLog = debug(`configs:bin[${cliName}]`);

handleUnhandledRejection();
debugLog({
  cli,
  argv,
  env,
  cliName,
});

(async () => {
  if (configs.customConfigsPath)
    logger.info(
      'Using external configuration',
      `Location: ${configs.customConfigsPath}`,
    );

  switch (cli) {
    case 'install':
      await execa(argv[0], argv.slice(1), {
        stdio: 'inherit',
      });
      return;

    default: {
      const server = await worker.init();

      /**
       * @example
       * removeFiles(0);
       *
       * @param {number} exitCode - process exit code
       */
      const removeFiles = (exitCode: number) => {
        if (!server) {
          process.exit(exitCode);
          return;
        }

        worker.writeCache({
          pid: process.pid,
          using: false,
        });

        debug('configs:remove:cache')(JSON.stringify(worker.cache, null, 2));

        Object.keys(worker.cache).forEach((key: string) => {
          /* eslint-disable flowtype/no-unused-expressions */
          // $FlowFixMe Flow does not yet support method or property calls in optional chains.
          worker.cache[key]?.pids.forEach((pid: number) => {
            /* eslint-enable flowtype/no-unused-expressions */
            if (!isRunning(pid))
              worker.writeCache({
                pid,
                using: false,
              });
          });
        });

        if (Object.keys(worker.cache).length !== 0) {
          setTimeout(removeFiles, 500, exitCode);
          return;
        }

        server.close(() => {
          process.exit(exitCode);
        });
      };

      // caught interrupt signal to remove files
      process.on('SIGINT', () => {
        removeFiles(0);
      });

      try {
        // [start]
        // handle config and ignore files
        generateFiles(cliName);

        // run command
        logger.log(
          chalk`Run command: {gray ${[
            path.basename(cli),
            ...argv.slice(2),
          ].join(' ')}}`,
        );

        const successCode = await execa(argv[0], [cli, ...argv.slice(2)], {
          stdio: 'inherit',
          env,
        }).then(({ code }: { code: number }) => code);

        debugLog('Run command success, remove files');

        removeFiles(successCode);
      } catch (e) {
        debugLog('Run command fail, remove files');
        debugLog(e);

        removeFiles(e.exitCode);
      }
      return;
    }
  }
})();
