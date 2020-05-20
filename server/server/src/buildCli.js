// @flow

import path from 'path';
import http from 'http';

import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';
import { type mergeDirEventType } from '@mikojs/utils/lib/mergeDir';
import typeof createLoggerType from '@mikojs/utils/lib/createLogger';

import getOptions, { type optionsType } from './utils/getOptions';

import {
  type middlewareType,
  type optionsType as serverOptionsType,
} from './index';

handleUnhandledRejection();

/**
 * TODO: should use async/await after flow fix error
 *
 * @param {Array} argv - command line
 * @param {string} defaultFolder - default folder
 * @param {createLoggerType} logger - logger function
 * @param {Function} buildMiddleware - use to build the middleware
 *
 * @return {any} - http server
 */
export default (
  argv: $ReadOnlyArray<string>,
  defaultFolder: string,
  logger: $Call<createLoggerType, string>,
  buildMiddleware: (
    folderPath: string,
    logger: $PropertyType<serverOptionsType, 'logger'>,
  ) => middlewareType<>,
): Promise<http.Server> => {
  logger.start('Server start');

  return getOptions(argv, defaultFolder)
    .then(({ port, folderPath }: optionsType): http.Server => {
      const middleware = buildMiddleware(
        folderPath,
        (type: 'start' | 'end', event: mergeDirEventType, filePath: string) => {
          const relativePath = path.relative(folderPath, filePath);

          if (type === 'start') {
            logger.start(
              chalk`{gray [${event}]} Server updating (${relativePath})`,
            );
            return;
          }

          logger.succeed(
            chalk`{gray [${event}]} Server updated (${relativePath})`,
          );
        },
      );
      const server = http.createServer(
        (req: http.IncomingMessage, res: http.ServerResponse) => {
          middleware(req, res);
        },
      );

      server.listen(port);
      logger.succeed(
        chalk`Running server at port: {gray {bold ${port.toString()}}}`,
      );

      return server;
    })
    .catch((e: Error) => {
      logger.fail(e.message);
      throw e;
    });
};
