#! /usr/bin/env node
// @flow

import path from 'path';

import buildApi from '../index';
import buildCli, { type loggerType } from '../buildCli';

(async () => {
  try {
    await buildCli(
      '@mikojs/server',
      process.argv,
      path.resolve('./api'),
      (folderPath: string, logger: loggerType) =>
        buildApi(folderPath, {
          logger,
        }),
    );
  } catch (e) {
    process.exit(1);
  }
})();
