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

export type buildDataType = {|
  exists: boolean,
  filePath: string,
  pathname: string,
|};

export type buildType = (data: buildDataType) => string;

type utilsType = {|
  writeToCache?: (filePath: string, content: string) => void,
  getFromCache?: (filePath: string) => middlewareType<>,
  watcher?: (filePath: string, callback: callbackType) => Promise<() => void>,
|};

type serverType = {|
  set: (utils: utilsType) => void,
  create: (build: buildType) => (folderPath: string) => middlewareType<void>,
  ready: () => Promise<() => void>,
  run: (
    build: buildType,
    folderPath: string,
    port: number,
    callback?: () => void,
  ) => Promise<ServerType>,
|};

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

export default (((): serverType => {
  const cache = {
    writeToCache: outputFileSync,
    getFromCache: requireModule,
    watcher,
  };
  const server = {
    /**
     * @param {utilsType} utils - new utils object
     */
    set: (utils: utilsType) => {
      Object.keys(utils).forEach((key: string) => {
        cache[key] = utils[key];
      });
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

      cache[hash] = cache.watcher(
        folderPath,
        (data: $ReadOnlyArray<dataType>) => {
          cache.writeToCache(
            cacheFilePath,
            data.reduce(
              (result: string, { exists, filePath }: dataType) =>
                build({
                  exists,
                  filePath,
                  pathname: path
                    .relative(folderPath, filePath)
                    .replace(/\.js$/, '')
                    .replace(/index$/, '')
                    .replace(/^/, '/')
                    .replace(/\[([^[\]]*)\]/g, ':$1'),
                }),
              '',
            ),
          );
        },
      );

      return (req: IncomingMessageType, res: ServerResponseType) => {
        const middleware = cache.getFromCache(cacheFilePath);

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
     * @return {Promise} - close function
     */
    ready: async (): Promise<() => void> => {
      const closes = await Promise.all(
        Object.keys(cache).map((key: string) => cache[key]),
      );

      return () => closes.forEach((close: () => void) => close());
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
      const close = await server.ready();
      const runningServer = http
        .createServer(middleware)
        .listen(port, callback);

      runningServer.on('close', close);

      return runningServer;
    },
  };

  return server;
})(): serverType);
