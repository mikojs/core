// @flow

import { type Server as ServerType } from 'http';

import ora from 'ora';
import chalk from 'chalk';

import { createLogger } from '@mikojs/utils';
import { type eventType } from '@mikojs/merge-dir/lib/utils/watcher';

import server, { type middlewareType } from './index';

const logger = createLogger('@mikojs/server', ora({ discardStdin: false }));

/**
 * @param {eventType} event - the event of the server
 * @param {number} port - the port of the server
 * @param {middlewareType} middleware - run the middleware in the server
 *
 * @return {ServerType} - server or null
 */
export default async (
  event: eventType,
  port: number,
  middleware: middlewareType,
): Promise<?ServerType> => {
  if (event === 'build') {
    logger.start('Building the server');
    server.set('build');
    (await server.ready())();
    logger.succeed(chalk`Use {green server start} to run the server`);
    return null;
  }

  logger.start('Preparing the server');
  server.set(event);

  return server.run(middleware, port, () => {
    logger.succeed('Running the server');
  });
};
