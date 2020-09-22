// @flow

import http, { type Server as ServerType } from 'http';

import { emptyFunction } from 'fbjs';
import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import { type callbackType } from './types';
import buildMiddleware from './index';

export type fetchResultType = BodyType;

type cacheType = {|
  server?: ServerType,
  port: number,
  close: () => Promise<void>,
  fetch: (pathname: string, options: *) => Promise<BodyType>,
  use: (folderPath: string) => Promise<void>,
|};

/**
 * @param {callbackType} callback - callback function to handle file
 *
 * @return {cacheType} - testing server object
 */
export default (callback: callbackType): cacheType => {
  const cache: cacheType = {
    port: -1,
    close: emptyFunction,

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
    use: async (folderPath: string) => {
      await cache.close();

      const port = await getPort();
      const middleware = await buildMiddleware(folderPath, callback);
      const server = http.createServer(middleware).listen(cache.port);

      cache.port = port;
      cache.server = server;

      /** */
      cache.close = async () => {
        server.close();
        await middleware.cancel?.();
      };
    },
  };

  return cache;
};
