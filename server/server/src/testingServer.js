// @flow

import { type Server as ServerType } from 'http';

import { emptyFunction } from 'fbjs';
import fetch, { type Response as ResponseType } from 'node-fetch';
import getPort from 'get-port';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

import { type callbackType } from './utils/watcher';

import server, { type middlewareType, type buildType } from './index';

export type fetchResultType = ResponseType;

export type testingServerType = {|
  close: () => ?ServerType,
  fetch: (pathname: string, options: *) => Promise<fetchResultType>,
  run: (folderPath: string) => Promise<void>,
|};

const cache: {|
  server?: ServerType,
  port: number,
  close: $PropertyType<testingServerType, 'close'>,
  [string]: middlewareType<>,
|} = {
  port: -1,

  /**
   * @return {ServerType} - server object
   */
  close: () => cache.server?.close(),
};

server.set({
  /**
   * @param {string} filePath - cache file path
   * @param {string} content - cache content
   */
  writeToCache: (filePath: string, content: string) => {
    // eslint-disable-next-line no-eval
    cache[filePath] = eval(content);
  },

  /**
   * @param {string} filePath - cache file path
   *
   * @return {middlewareType} - middleware cache
   */
  getFromCache: (filePath: string) => cache[filePath],

  /**
   * @param {string} folderPath - folder path
   * @param {callbackType} callback - handle files function
   *
   * @return {Function} - close client
   */
  watcher: async (
    folderPath: string,
    callback: callbackType,
  ): Promise<() => void> => {
    callback(
      d3DirTree(folderPath)
        .leaves()
        .map(({ data }: d3DirTreeNodeType) => ({
          exists: true,
          filePath: data.path,
        })),
    );

    return emptyFunction;
  },
});

/**
 * @param {buildType} build - build middleware cache function
 *
 * @return {testingServerType} - testing server cache
 */
export default (build: buildType): testingServerType => ({
  close: cache.close,

  /**
   * @param {string} pathname - request pathname
   * @param {object} options - request object
   *
   * @return {ResponseType} - request body
   */
  fetch: (pathname: string, options?: *) =>
    fetch(`http://localhost:${cache.port}${pathname}`, options),

  /**
   * @param {string} folderPath - folder path
   */
  run: async (folderPath: string) => {
    cache.close();
    cache.port = await getPort();
    cache.server = await server.run(build, folderPath, cache.port);
  },
});
