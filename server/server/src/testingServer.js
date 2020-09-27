// @flow

import { type Server as ServerType } from 'http';

import fetch, { type Body as BodyType } from 'node-fetch';
import getPort from 'get-port';

import server, { type buildType } from './index';

export type fetchResultType = BodyType;

type cacheType = {|
  server?: ServerType,
  port: number,
  close: () => ?ServerType,
  fetch: (pathname: string, options: *) => Promise<BodyType>,
  run: (folderPath: string) => Promise<void>,
|};

/**
 * @param {buildType} build - build middleware cache function
 *
 * @return {cacheType} - testing server cache
 */
export default (build: buildType): cacheType => {
  const cache: cacheType = {
    port: -1,

    /**
     * @return {ServerType} - server object
     */
    close: () => cache.server?.close(),

    /**
     * @param {string} pathname - request pathname
     * @param {object} options - request object
     *
     * @return {BodyType} - request body
     */
    fetch: (pathname: string, options?: *) =>
      fetch(`http://localhost:${cache.port}${pathname}`, options),

    /**
     * @param {string} folderPath - folder path
     */
    run: async (folderPath: string) => {
      cache.close();

      cache.port = await getPort();
      cache.server = server.run(build, folderPath, cache.port);
    },
  };

  return cache;
};
