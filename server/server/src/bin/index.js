#! /usr/bin/env node
// @flow

import ora from 'ora';
import chalk from 'chalk';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

import server from '../index';

import getServerOptions from 'utils/getServerOptions';

const logger = createLogger('@mikojs/server', ora({ discardStdin: false }));

handleUnhandledRejection();

(async () => {
  const { event } = await getServerOptions(process.argv);

  switch (event) {
    case 'error':
      logger
        .fail(chalk`Missing required argument {red <event>}`)
        .fail(chalk`Use {gray -h} to get the more information`);
      process.exit(1);
      break;

    default:
      server.set(event);
      break;
  }
})();
