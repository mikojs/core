// @flow

import http, { type Server as ServerType } from 'http';

import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import { type middlewareType } from './index';

export type fetchResultType = BodyType;

type cacheType = {|
  port: number,
  server?: ServerType,
  use: (middleware: middlewareType) => Promise<void>,
  close: () => ?ServerType,
  fetch: (pathname: string, options: *) => Promise<BodyType>,
|};

/**
 * @return {cacheType} - testing server object
 */
export default (): cacheType => {
  const cache: cacheType = {
    port: -1,

    /**
     * @param {middlewareType} middleware - middleware function
     */
    use: async (middleware: middlewareType) => {
      const server = http.createServer(middleware);

      cache.close();
      cache.port = await getPort();
      cache.server = server.listen(cache.port);
    },

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
  };

  return cache;
};
