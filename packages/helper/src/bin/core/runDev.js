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
    // Run command
    if (errCode) clearConsole();

    logger.info(
      chalk`${errCode ? 'Rerun' : 'Run'} {green \`${cliOptions.args}\`}`,
    );

    const { exitCode, stderr } = await new Promise((resolve, reject) => {
      const runCmd = execa.shell(cliOptions.args);
      let cmdErr: string = '';

      runCmd.stdout.on('data', (chunk: string) => {
        process.stdout.write(chunk.toString());
      });

      runCmd.stderr.on('data', (chunk: string) => {
        process.stdout.write(chunk.toString());
        cmdErr += chunk;
      });

      runCmd.on('close', (cmdCode: number) => {
        resolve({
          exitCode: cmdCode,
          stderr: cmdErr,
        });
      });
    });

    // Close command without any error
    if (exitCode === 0) break;

    process.stdout.write('\n');

    if (errMessage !== stderr) {
      errCode = exitCode;
      errMessage = stderr;

      debug('helper:runDev')({
        stderr,
        exitCode,
      });

      // Rerun command when error handle done
      if (await handleError(stderr)) continue;
    }

    // Watching files to rerun command
    await new Promise(resolve => {
      // FIXME should use with pkg
      const watcher = chokidar.watch(path.resolve(cliOptions.root), {
        ignored: /.swp/,
        ignoreInitial: true,
      });

      clearConsole();
      logger.warn(chalk`Can not run {red \`${cliOptions.args}\`}

{gray ${stderr}}`);

      ['add', 'addDir', 'change'].forEach((eventName: string) => {
        watcher.on(eventName, () => {
          watcher.close();
          resolve();
        });
      });
    });
  }
})();
