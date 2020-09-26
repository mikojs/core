// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

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

type buildType = (data: dataType) => string;

type serverType = {|
  load: (build: buildType) => (folderPath: string) => middlewareType<void>,
|};

type contextType = {|
  cache: {|
    [string]: {|
      folderPath: string,
      cacheFilePath: string,
      build: buildType,
    |},
  |},
|};

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

/**
 * @return {serverType} - server object
 */
const buildServer = (): serverType => {
  const context: contextType = {
    cache: {},
  };

  return {
    /**
     * @param {buildType} build - build middleware cache function
     *
     * @return {Function} - build middleware
     */
    load: (build: buildType) => (folderPath: string): middlewareType<void> => {
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
};

export default buildServer();
