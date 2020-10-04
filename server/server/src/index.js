// @flow

import http, {
  type Server as ServerType,
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';
import path from 'path';

import { emptyFunction, invariant } from 'fbjs';
import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';
import outputFileSync from 'output-file-sync';

import { requireModule } from '@mikojs/utils';

import watcher, { type dataType, type callbackType } from './utils/watcher';

export type middlewareType<R = Promise<void>> = (
  req: IncomingMessageType,
  res: ServerResponseType,
) => R | void;

export type buildType = (data: dataType) => string;

type serverType = {|
  cache: {| [string]: Promise<() => void> |},
  utils: {|
    writeToCache: (filePath: string, content: string) => void,
    getFromCache: (filePath: string) => middlewareType<>,
    watcher: (filePath: string, callback: callbackType) => Promise<() => void>,
  |},
  create: (build: buildType) => (folderPath: string) => middlewareType<void>,
  run: (
    build: buildType,
    folderPath: string,
    port: number,
    callback?: () => void,
  ) => Promise<ServerType>,
|};

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

export default (((): serverType => {
  const server = {
    cache: {},

    utils: {
      writeToCache: outputFileSync,
      getFromCache: requireModule,
      watcher,
    },

    /**
     * @param {buildType} build - build middleware cache function
     *
     * @return {Function} - build middleware
     */
    create: (build: buildType) => (
      folderPath: string,
    ): middlewareType<void> => {
      const hash = cryptoRandomString({ length: 10, type: 'alphanumeric' });
      const cacheFilePath = cacheDir(`${hash}.js`);

      server.cache[hash] = server.utils.watcher(
        folderPath,
        (data: $ReadOnlyArray<dataType>) => {
          server.utils.writeToCache(
            cacheFilePath,
            data.reduce((result: string, d: dataType) => build(d), ''),
          );
        },
      );

      return (req: IncomingMessageType, res: ServerResponseType) => {
        const middleware = server.utils.getFromCache(cacheFilePath);

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
     * @param {buildType} build - build middleware cache function
     * @param {string} folderPath - folder path
     * @param {number} port - server port
     * @param {Function} callback - server callback function
     *
     * @return {ServerType} - server object
     */
    run: async (
      build: buildType,
      folderPath: string,
      port: number,
      callback?: () => void = emptyFunction,
    ): Promise<ServerType> => {
      const middleware = server.create(build)(folderPath);
      const closes = await Promise.all(
        Object.keys(server.cache).map((key: string) => server.cache[key]),
      );
      const runningServer = http
        .createServer(middleware)
        .listen(port, emptyFunction);

      runningServer.on('close', () =>
        closes.forEach((close: () => void) => close()),
      );

      return runningServer;
    },
  };

  return server;
})(): serverType);
