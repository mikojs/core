// @flow

import http, {
  type Server as ServerType,
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import { emptyFunction } from 'fbjs';
import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';

import { requireModule } from '@mikojs/utils';

export type middlewareType<R = Promise<void>> = (
  req: IncomingMessageType,
  res: ServerResponseType,
) => R | void;

type dataType = {|
  exists: boolean,
  filePath: string,
|};

export type buildType = (data: dataType) => string;

type serverType = {|
  create: (build: buildType) => (folderPath: string) => middlewareType<void>,
  run: (
    build: buildType,
    folderPath: string,
    port: number,
    callback?: () => void,
  ) => ServerType,
|};

type contextType = {|
  cache: {|
    [string]: {|
      folderPath: string,
      cacheFilePath: string,
      build: buildType,
    |},
  |},
  create: $PropertyType<serverType, 'create'>,
|};

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

export default ((): serverType => {
  const context: contextType = {
    cache: {},

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

      context.cache[hash] = {
        folderPath,
        cacheFilePath,
        build,
      };

      return (req: IncomingMessageType, res: ServerResponseType) => {
        requireModule<middlewareType<>>(cacheFilePath)(req, res);
      };
    },
  };

  return {
    create: context.create,

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
        .createServer(context.create(build)(folderPath))
        .listen(port, emptyFunction),
  };
})();
