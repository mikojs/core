#! /usr/bin/env node
// @flow

import path from 'path';

import buildCli, { type loggerType } from '@mikojs/server/lib/buildCli';

import buildGraphql from '../index';

(async () => {
  try {
    await buildCli(
      '@mikojs/graphql',
      process.argv,
      path.resolve('./graphql'),
      (folderPath: string, logger: loggerType) =>
        buildGraphql(folderPath, {
          logger,
        }),
    );
  } catch (e) {
    process.exit(1);
  }
})();
