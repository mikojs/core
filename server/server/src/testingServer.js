// @flow

import { type Server as ServerType } from 'http';

import { emptyFunction } from 'fbjs';
import fetch, { type Body as BodyType } from 'node-fetch';
import getPort from 'get-port';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

import { type callbackType } from './utils/watcher';

import server, { type middlewareType, type buildType } from './index';

export type fetchResultType = BodyType;

type testingServerType = {|
  server?: ServerType,
  cache: { [string]: middlewareType<> },
  port: number,
  close: () => ?ServerType,
  fetch: (pathname: string, options: *) => Promise<BodyType>,
  run: (folderPath: string) => Promise<void>,
|};

/**
 * @param {buildType} build - build middleware cache function
 *
 * @return {testingServerType} - testing server cache
 */
export default (build: buildType): testingServerType => {
  const testingServer: testingServerType = {
    cache: {},
    port: -1,

    /**
     * @return {ServerType} - server object
     */
    close: () => testingServer.server?.close(),

    /**
     * @param {string} pathname - request pathname
     * @param {object} options - request object
     *
     * @return {BodyType} - request body
     */
    fetch: (pathname: string, options?: *) =>
      fetch(`http://localhost:${testingServer.port}${pathname}`, options),

    /**
     * @param {string} folderPath - folder path
     */
    run: async (folderPath: string) => {
      testingServer.close();

      testingServer.port = await getPort();
      testingServer.server = server.run(build, folderPath, testingServer.port);
    },
  };

  server.utils = {
    /**
     * @param {string} filePath - cache file path
     * @param {string} content - cache content
     */
    writeToCache: (filePath: string, content: string) => {
      // eslint-disable-next-line no-eval
      testingServer.cache[filePath] = eval(content);
    },

    /**
     * @param {string} filePath - cache file path
     *
     * @return {middlewareType} - middleware cache
     */
    getFromCache: (filePath: string) => testingServer.cache[filePath],

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
  };

  return testingServer;
};
