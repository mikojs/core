#! /usr/bin/env node
// @flow

import ora from 'ora';
import chalk from 'chalk';
import { emptyFunction } from 'fbjs';

import {
  handleUnhandledRejection,
  createLogger,
  requireModule,
} from '@mikojs/utils';

import server, { type middlewareType } from '../index';

import getServerOptions from 'utils/getServerOptions';

const logger = createLogger('@mikojs/server', ora({ discardStdin: false }));

handleUnhandledRejection();

(async () => {
  const { event, filePath } = await getServerOptions(process.argv);
  const middleware =
    event === 'error' ? emptyFunction : requireModule<middlewareType>(filePath);

  switch (event) {
    case 'error':
      logger
        .fail(chalk`Missing required argument {red <event>}`)
        .fail(chalk`Use {gray -h} to get the more information`);
      process.exit(1);
      break;

    case 'build':
      logger.start('Building the server');
      server.set('build');
      (await server.ready())();
      logger.succeed(chalk`Use {green server start} to run the server`);
      break;

    default:
      logger.start('Running the server');
      server.set(event);
      server.run(middleware, 3000, () => {
        logger.succeed('Stop the server');
      });
      break;
  }
})();
