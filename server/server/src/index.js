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

type middlewareType<R = Promise<void>> = (
  req: IncomingMessageType,
  res: ServerResponseType,
) => R | void;

export type buildType = (data: {|
  exists: boolean,
  filePath: string,
|}) => string;

type cacheType = {|
  create: (build: buildType) => (folderPath: string) => middlewareType<void>,
  run: (
    build: buildType,
    folderPath: string,
    port: number,
    callback?: () => void,
  ) => ServerType,
|};

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

export default ((): cacheType => {
  const cache = {
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
      outputFileSync(
        cacheFilePath,
        build({ exists: true, filePath: folderPath }),
      );

      return (req: IncomingMessageType, res: ServerResponseType) => {
        requireModule<middlewareType<>>(cacheFilePath)(req, res);
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
        .createServer(cache.create(build)(folderPath))
        .listen(port, emptyFunction),
  };

  return cache;
})();
