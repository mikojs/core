// @flow

import path from 'path';

import debug from 'debug';
import execa from 'execa';
import chokidar from 'chokidar';
import chalk from 'chalk';
import { areEqual } from 'fbjs';

import { handleUnhandledRejection } from '@cat-org/logger';

import cliOptions from './cliOptions';
import clearConsole from './clearConsole';

import logger from 'utils/logger';
import handleError from 'utils/handleError';

handleUnhandledRejection();

if (process.env.NODE_ENV !== 'development')
  logger.fail('Do not use `runDev` file directly');

(async (): Promise<void> => {
  let errCode: ?number;
  let errData: ?string;

  while (errCode !== 0) {
    try {
      clearConsole();
      logger.info(
        chalk`${errCode ? 'Rerun' : 'Run'} {green \`${cliOptions.args}\`}`,
      );

      // TODO result
      await execa.shell(cliOptions.args, {
        stdio: 'inherit',
      });
    } catch (e) {
      const { code } = e;

      if (areEqual(e, errData)) {
        // FIXME should use with pkg
        const watcher = chokidar.watch(path.resolve(cliOptions.root), {
          ignoreInitial: true,
        });

        clearConsole();
        logger.warn(chalk`Can not run {red \`${cliOptions.args}\`}

{gray ${e}}`);
        debug('helper:runDev')(e);

        await new Promise(resolve => {
          watcher.on('all', () => {
            watcher.close();
            resolve();
          });
        });
      } else {
        errCode = code;
        errData = e;

        // TODO result
        await handleError(errData);
      }
    }
  }
})();
