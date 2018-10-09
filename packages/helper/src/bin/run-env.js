#! /usr/bin/env node
// @flow

import execa from 'execa';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/logger';

import cliOptions from './core/cliOptions';

import logger from 'utils/logger';
import analyticsRepo from 'utils/analyticsRepo';
import handleError from 'utils/handleError';

handleUnhandledRejection();

// TODO data
analyticsRepo(cliOptions.root);

logger.info(chalk`Root folder: ${cliOptions.root}`);

(async (): Promise<void> => {
  let errCode: ?number;
  let errMessage: ?string;

  while (errCode !== 0) {
    try {
      // TODO result
      await execa.shell(cliOptions.args);
    } catch (e) {
      const { code, stderr } = e;

      if (stderr === errMessage) throw e;

      errCode = code;
      errMessage = stderr;

      // TODO result
      await handleError(errMessage);
    }
  }
})();
