// @flow

import path from 'path';
import http from 'http';

import chalk from 'chalk';
import debug from 'debug';

import { handleUnhandledRejection } from '@mikojs/utils';
import { type mergeDirEventType } from '@mikojs/utils/lib/mergeDir';
import typeof createLoggerType from '@mikojs/utils/lib/createLogger';

import getOptions from './utils/getOptions';

import { type middlewareType, type optionsType } from './index';

export type loggerType = $PropertyType<optionsType, 'logger'>;

const debugLog = debug('server:buildCli');

handleUnhandledRejection();

/**
 * @param {Array} argv - command line
 * @param {string} defaultFolder - default folder
 * @param {createLoggerType} logger - logger function
 * @param {Function} buildMiddleware - use to build the middleware
 *
 * @return {any} - http server
 */
export default async (
  argv: $ReadOnlyArray<string>,
  defaultFolder: string,
  logger: $Call<createLoggerType, string>,
  buildMiddleware: (folderPath: string, logger: loggerType) => middlewareType<>,
): Promise<http.Server> => {
  logger.start('Server start');

  try {
    const { port, folderPath } = await getOptions(argv, defaultFolder);
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

    debugLog({ port, folderPath, middleware, server });
    server.listen(port);
    logger.succeed(
      chalk`Running server at port: {gray {bold ${port.toString()}}}`,
    );

    return server;
  } catch (e) {
    debugLog(e);
    logger.fail(e.message);
    throw e;
  }
};
