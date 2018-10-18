#! /usr/bin/env node
// @flow

import execa from 'execa';

import { handleUnhandledRejection } from '@cat-org/logger';

import cliOptions from './core/cliOptions';

import logger from 'utils/logger';
import analyticsRepo from 'utils/analyticsRepo';
import handleError from 'utils/handleError';

handleUnhandledRejection();

// TODO data
analyticsRepo(cliOptions.root);

logger.info(
  'process.env.NODE_ENV ➜ development',
  `Root folder ➜ ${cliOptions.root}`,
);

process.env.NODE_ENV = 'development';

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
