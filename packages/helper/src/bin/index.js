#! /usr/bin/env node
// @flow

import path from 'path';

import execa from 'execa';

import { handleUnhandledRejection } from '@cat-org/logger';

import cliOptions from './core/cliOptions';

import logger from 'utils/logger';

handleUnhandledRejection();

(async (): Promise<void> => {
  const NODE_ENV = cliOptions.production ? 'production' : 'development';

  logger.info(`Root folder ➜ ${cliOptions.root}`, `NODE_ENV ➜ ${NODE_ENV}`);

  try {
    await execa(
      'node',
      [path.resolve(__dirname, './core/runDev'), ...process.argv.slice(2)],
      {
        stdio: 'inherit',
        env: {
          NODE_ENV,
        },
      },
    );
  } catch (e) {}
})();
