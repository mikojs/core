#! /usr/bin/env node
// @flow

import path from 'path';

import execa from 'execa';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import cliOptions from 'utils/cliOptions';
import clearConsole from 'utils/clearConsole';

handleUnhandledRejection();

(async (): Promise<void> => {
  const { production, root } = cliOptions(process.argv);
  const NODE_ENV = production ? 'production' : 'development';

  if (!production) clearConsole();

  logger.info(`Root folder ➜ ${root}`, `NODE_ENV ➜ ${NODE_ENV}`);

  try {
    await execa(
      'node',
      [path.resolve(__dirname, './runDev'), ...process.argv.slice(2)],
      {
        stdio: 'inherit',
        env: {
          NODE_ENV,
        },
      },
    );
  } catch (e) {}
})();
