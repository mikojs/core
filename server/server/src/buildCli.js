// @flow

import http from 'http';

import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';
import typeof createLoggerType from '@mikojs/utils/lib/createLogger';

import getOptions, { type optionsType } from './utils/getOptions';
import {
  type optionsType as serverOptionsType,
  type middlewareType,
} from './index';

handleUnhandledRejection();

/**
 * @example
 * buildCli(argv, callback)
 *
 * TODO: should use async/await after flow fix error
 *
 * @param {Array} argv - command line
 * @param {string} defaultFolder - default folder
 * @param {createLoggerType} logger - logger function
 * @param {Function} callback - use to build the middleware
 *
 * @return {any} - http server
 */
export default <
  C: (folderPath: string, options: serverOptionsType) => middlewareType<>,
>(
  argv: $ReadOnlyArray<string>,
  defaultFolder: string,
  logger: $Call<createLoggerType, string>,
  callback: C,
): Promise<http.Server> => {
  logger.start('Server start');

  return getOptions(argv, defaultFolder).then(
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
