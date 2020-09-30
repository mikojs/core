// @flow

import http, {
  type Server as ServerType,
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import { emptyFunction } from 'fbjs';
import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';
import outputFileSync from 'output-file-sync';

import { requireModule } from '@mikojs/utils';

export type middlewareType<R = Promise<void>> = (
  req: IncomingMessageType,
  res: ServerResponseType,
) => R | void;

export type buildType = (data: {|
  exists: boolean,
  filePath: string,
|}) => string;

type serverType = {|
  utils: {|
    writeToCache: (filePath: string, content: string) => void,
    getFromCache: (filePath: string) => middlewareType<>,
  |},
  create: (build: buildType) => (folderPath: string) => middlewareType<void>,
  run: (
    build: buildType,
    folderPath: string,
    port: number,
    callback?: () => void,
  ) => ServerType,
|};

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

export default ((): serverType => {
  const server = {
    utils: {
      writeToCache: outputFileSync,
      getFromCache: requireModule,
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

      // TODO: add watcher
      server.utils.writeToCache(
        cacheFilePath,
        build({ exists: true, filePath: folderPath }),
      );

      return (req: IncomingMessageType, res: ServerResponseType) => {
        server.utils.getFromCache(cacheFilePath)(req, res);
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
    run: (
      build: buildType,
      folderPath: string,
      port: number,
      callback?: () => void = emptyFunction,
    ) =>
      http
        .createServer(server.create(build)(folderPath))
        .listen(port, emptyFunction),
  };

  return server;
})();
