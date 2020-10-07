// @flow

import http, {
  type Server as ServerType,
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';
import path from 'path';

import { emptyFunction, invariant } from 'fbjs';

import mergeDir, { type buildType } from '@mikojs/merge-dir';

export type middlewareType = (
  req: IncomingMessageType,
  res: ServerResponseType,
) => void;

type createMiddlewareType = (folderPath: string) => middlewareType;

export default {
  ready: mergeDir.ready,

  /**
   * @param {buildType} build - build middleware cache function
   *
   * @return {Function} - build middleware
   */
  create: (build: buildType): createMiddlewareType => (
    folderPath: string,
  ): middlewareType => {
    const cacheFilePath = mergeDir.set(folderPath, build);

    return (req: IncomingMessageType, res: ServerResponseType) => {
      const middleware = mergeDir.get(cacheFilePath);

      invariant(
        middleware,
        `Should build the middleware before using this middleware: ${path.relative(
          process.cwd(),
          folderPath,
        )}`,
      );
      middleware(req, res);
    };
  },

  /**
   * @param {middlewareType} middleware - middleware function
   * @param {number} port - server port
   * @param {Function} callback - server callback function
   *
   * @return {ServerType} - server object
   */
  run: async (
    middleware: middlewareType,
    port: number,
    callback?: () => void = emptyFunction,
  ): Promise<ServerType> => {
    const close = await mergeDir.ready();
    const runningServer = http.createServer(middleware).listen(port, callback);

    runningServer.on('close', close);

    return runningServer;
  },
};
