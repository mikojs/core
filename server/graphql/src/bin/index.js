#! /usr/bin/env node
// @flow

import path from 'path';

import ora from 'ora';

import { createLogger } from '@mikojs/utils';
import buildCli, { type loggerType } from '@mikojs/server/lib/buildCli';

import buildGraphql from '../index';

(async () => {
  try {
    await buildCli(
      process.argv,
      path.resolve('./graphql'),
      createLogger('@mikojs/graphql', ora({ discardStdin: false })),
      (folderPath: string, logger: loggerType) =>
        buildGraphql(folderPath, {
          logger,
        }),
    );
  } catch (e) {
    process.exit(1);
  }
})();
