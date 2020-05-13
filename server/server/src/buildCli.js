// @flow

import http from 'http';

import ora from 'ora';
import chalk from 'chalk';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

import getOptions, { type optionsType } from './utils/getOptions';
import {
  type optionsType as serverOptionsType,
  type middlewareType,
} from './index';

const logger = createLogger('@mikojs/miko', ora({ discardStdin: false }));

handleUnhandledRejection();

/**
 * @example
 * buildCli(argv, callback)
 *
 * TODO: should use async/await after flow fix error
 *
 * @param {Array} argv - command line
 * @param {Function} callback - use to build the middleware
 *
 * @return {any} - http server
 */
export default <
  C: (folderPath: string, options: serverOptionsType) => middlewareType<>,
>(
  argv: $ReadOnlyArray<string>,
  callback: C,
): Promise<http.Server> => {
  logger.start('Server start');

  return getOptions(argv).then(
    ({ port, folderPath }: optionsType): http.Server => {
      const server = http.createServer(
        callback(folderPath, {
          dev: process.env.NODE_ENV !== 'production',
          logger,
        }),
      );

      server.listen(port);
      logger.succeed(
        chalk`Running server at port: {gray {bold ${port.toString()}}}`,
      );

      return server;
    },
  );
};
