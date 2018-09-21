#! /usr/bin/env node
// @flow

import childProcess from 'child_process';

import debug from 'debug';
import isRunning from 'is-running';

import cliOptions from './core/cliOptions';

import configs from 'utils/configs';
import generateFiles from 'utils/generateFiles';
import worker from 'utils/worker';

const { cliName } = cliOptions;
const { cli, argv, env } = configs.getConfig(cliOptions);
const debugLog = debug(`configs-scripts:bin[${cliName}]`);

process.on('unhandledRejection', (error: mixed) => {
  throw error;
});

(async (): Promise<void> => {
  switch (cli) {
    case 'install':
      childProcess.spawn(argv[0], argv.slice(1), {
        stdio: 'inherit',
      });
      return;

    default: {
      const server = await worker.init();

      /**
       * Remove files
       *
       * @example
       * removeFiles(0);
       *
       * @param {number} exitCode - process exit code
       */
      const removeFiles = (exitCode: number) => {
        if (server) {
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
          return;
        }

        process.exit(exitCode);
        return;
      };

      // caught interrupt signal to remove files
      process.on('SIGINT', () => {
        removeFiles(0);
      });

      // handle config and ignore files
      generateFiles(cliOptions);

      // run command
      debugLog(
        `Run command: ${JSON.stringify(
          [argv[0], cli, ...argv.slice(2)],
          null,
          2,
        )}`,
      );
      childProcess
        .spawn(argv[0], [cli, ...argv.slice(2)], {
          stdio: 'inherit',
          env: {
            ...process.env,
            ...env,
          },
        })
        .on('close', (exitCode: number) => {
          debugLog('Run command done, remove files');
          removeFiles(exitCode);
        });
      return;
    }
  }
})();
