#! /usr/bin/env node
// @flow

import path from 'path';

import debug from 'debug';
import execa from 'execa';
import chokidar from 'chokidar';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import clearConsole from 'utils/clearConsole';
import cliOptions from 'utils/cliOptions';
import handleError from 'utils/handleError';

handleUnhandledRejection();

(async (): Promise<void> => {
  const { args, root } = cliOptions(process.argv);
  const NODE_ENV = 'development';
  const cmdOptions = {
    env: {
      NODE_ENV,
    },
  };
  let errCode: ?number;
  let errMessage: ?string;

  clearConsole();

  while (errCode !== 0) {
    // Run command
    if (errCode) clearConsole();

    logger.info(
      `Root folder ➜ ${root}`,
      `NODE_ENV ➜ ${NODE_ENV}`,
      chalk`${errCode ? 'Rerun' : 'Run'} {green \`${args}\`}`,
    );

    const { exitCode, stderr } = await new Promise((resolve, reject) => {
      const runCmd = execa.shell(args, cmdOptions);
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
      const watcher = chokidar.watch(path.resolve(root), {
        ignored: /.swp/,
        ignoreInitial: true,
      });

      clearConsole();
      logger.warn(chalk`Can not run {red \`${args}\`}

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
