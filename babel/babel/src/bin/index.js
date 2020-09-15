#! /usr/bin/env node
// @flow

import ora from 'ora';
import watchman from 'fb-watchman';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

const logger = createLogger('@mikojs/miko', ora({ discardStdin: false }));
const client = new watchman.Client();

handleUnhandledRejection();
logger.start('Watching files');
client.capabilityCheck(
  {
    optional: [],
    required: ['relative_root'],
  },
  (err: string, { warning }: {| warning?: string |}) => {
    if (err) {
      logger.fail(err);
      client.end();
      return;
    }

    if (warning) logger.warn(warning).start('Watching files');
  },
);
