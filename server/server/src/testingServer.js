// @flow

import { type Server as ServerType } from 'http';

import fetch, { type Body as BodyType } from 'node-fetch';
import getPort from 'get-port';

import server, { type buildType } from './index';

export type fetchResultType = BodyType;

type testingServerType = {|
  server?: ServerType,
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

  return testingServer;
};
