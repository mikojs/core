#! /usr/bin/env node
// @flow

import execa from 'execa';
import debug from 'debug';
import isRunning from 'is-running';

import { handleUnhandledRejection } from '@cat-org/logger';

import configs from 'utils/configs';
import cliOptions from 'utils/cliOptions';
import generateFiles from 'utils/generateFiles';
import worker from 'utils/worker';
import logger from 'utils/logger';

const { cli, argv, env, cliName } = cliOptions(process.argv);
const debugLog = debug(`configs-scripts:bin[${cliName}]`);

handleUnhandledRejection();
debugLog({
  cli,
  argv,
  env,
  cliName,
});

(async (): Promise<void> => {
  if (configs.customConfigsPath)
    logger.info(
      'Using external configsuration',
      `Location: ${configs.customConfigsPath}`,
    );

  switch (cli) {
    case 'install':
      execa(argv[0], argv.slice(1), {
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

        debug('configs-scripts:remove:cache')(
          JSON.stringify(worker.cache, null, 2),
        );

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

      // [start]
      // handle config and ignore files
      generateFiles(cliName);

      // run command
      debugLog(
        `Run command: ${JSON.stringify(
          [argv[0], cli, ...argv.slice(2)],
          null,
          2,
        )}`,
      );

      try {
        const { code } = await execa(argv[0], [cli, ...argv.slice(2)], {
          stdio: 'inherit',
          env,
        });

        debugLog('Run command success, remove files');

        removeFiles(code);
      } catch (e) {
        debugLog('Run command fail, remove files');
        debugLog(e);

        removeFiles(e.code);
      }
      return;
    }
  }
})();
