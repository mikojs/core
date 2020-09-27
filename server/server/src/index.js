// @flow

import {
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
|};

type contextType = {|
  initialized: false,
  initialMiddleware: middlewareType<void>,
  cache: {|
    [string]: {|
      folderPath: string,
      cacheFilePath: string,
      build: buildType,
    |},
  |},
|};

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

export default ((): serverType => {
  const context: contextType = {
    initialized: false,
    initialMiddleware: emptyFunction,
    cache: {},
  };

  return {
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

      /** @middleware middleware wrapper */
      const middleware = (
        req: IncomingMessageType,
        res: ServerResponseType,
      ) => {
        requireModule<middlewareType<>>(cacheFilePath)(req, res);
      };

      context.cache[hash] = {
        folderPath,
        cacheFilePath,
        build,
      };

      if (!context.initialized) context.initialMiddleware = middleware;

      return middleware;
    },
  };
})();
