// @flow

import path from 'path';

import debug from 'debug';
import execa from 'execa';
import chokidar from 'chokidar';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/logger';

import cliOptions from './cliOptions';

import logger from 'utils/logger';
import clearConsole from 'utils/clearConsole';
import handleError from 'utils/handleError';

handleUnhandledRejection();

if (process.env.NODE_ENV !== 'development')
  logger.fail('Do not use `runDev` file directly');

(async (): Promise<void> => {
  let errCode: ?number;
  let errMessage: ?string;

  while (errCode !== 0) {
    try {
      clearConsole();
      logger.info(
        chalk`${errCode ? 'Rerun' : 'Run'} {green \`${cliOptions.args}\`}`,
      );

      errCode = await new Promise((resolve, reject) => {
        const runCmd = execa.shell(cliOptions.args);
        let stderr: string = '';

        runCmd.stdout.on('data', (chunk: string) => {
          process.stdout.write(chunk.toString());
        });

        runCmd.stderr.on('data', (chunk: string) => {
          process.stdout.write(chunk.toString());
          stderr += chunk;
        });

        runCmd.on('close', (exitCode: number) => {
          if (exitCode === 0) resolve(exitCode);
          else
            reject(
              new Error(
                JSON.stringify({
                  stderr,
                  exitCode,
                }),
              ),
            );
        });
      });
    } catch (e) {
      const { stderr, exitCode } = JSON.parse(e.message);

      if (stderr === errMessage) {
        // FIXME should use with pkg
        const watcher = chokidar.watch(path.resolve(cliOptions.root), {
          ignoreInitial: true,
        });

        clearConsole();
        logger.warn(chalk`Can not run {red \`${cliOptions.args}\`}

{gray ${stderr}}`);
        debug('helper:runDev')({
          stderr,
          exitCode,
        });

        await new Promise(resolve => {
          watcher.on('all', () => {
            watcher.close();
            resolve();
          });
        });
      } else {
        errCode = exitCode;
        errMessage = stderr;

        // TODO result
        await handleError(errMessage);
      }
    }
  }
})();
