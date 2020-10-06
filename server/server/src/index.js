// @flow

import http, {
  type Server as ServerType,
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';
import path from 'path';

import { emptyFunction, invariant } from 'fbjs';

import cache, {
  type buildType,
  type buildDataType,
  type middlewareType as cacheMiddlewareType,
} from './utils/cache';

export type middlewareType<R = Promise<void>> = cacheMiddlewareType<R>;
export type dataType = buildDataType;

type serverType = {|
  set: $PropertyType<typeof cache, 'updateTools'>,
  ready: $PropertyType<typeof cache, 'ready'>,
  create: (build: buildType) => (folderPath: string) => middlewareType<void>,
  run: (
    middleware: middlewareType<void>,
    port: number,
    callback?: () => void,
  ) => Promise<ServerType>,
|};

export default ({
  set: cache.updateTools,
  ready: cache.ready,

  /**
   * @param {buildType} build - build middleware cache function
   *
   * @return {Function} - build middleware
   */
  create: (build: buildType) => (folderPath: string): middlewareType<void> => {
    const cacheFilePath = cache.set(folderPath, build);

    return (req: IncomingMessageType, res: ServerResponseType) => {
      const middleware = cache.get(cacheFilePath);

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
    middleware: middlewareType<void>,
    port: number,
    callback?: () => void = emptyFunction,
  ): Promise<ServerType> => {
    const close = await cache.ready();
    const runningServer = http.createServer(middleware).listen(port, callback);

    runningServer.on('close', close);

    return runningServer;
  },
}: serverType);
