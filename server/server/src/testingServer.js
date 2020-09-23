// @flow

import http, { type Server as ServerType } from 'http';

import { emptyFunction } from 'fbjs';
import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import buildMiddleware from './index';

export type fetchResultType = BodyType;

type cacheType = {|
  server?: ServerType,
  port: number,
  close: () => void,
  fetch: (pathname: string, options: *) => Promise<BodyType>,
  use: (folderPath: string) => Promise<void>,
|};

jest.mock('fb-watchman', () => ({
  Client: class MockWatchman {
    mockErr = jest.fn();
    mockResp = jest.fn();

    /**
     * @param {any} optinos - function options
     * @param {Function} callback - callback function
     */
    mockFunction = (
      optinos: mixed,
      callback: (err: Error, resp: mixed) => void,
    ) => {
      callback(this.mockErr(), this.mockResp());
    };

    capabilityCheck = this.mockFunction;
    end = jest.fn();
  },
}));

/**
 * @return {cacheType} - testing server object
 */
export default (): cacheType => {
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
      cache.close();

      const port = await getPort();
      const middleware = await buildMiddleware(folderPath, 'dev');
      const server = http.createServer(middleware).listen(port);

      cache.port = port;
      cache.server = server;

      /** */
      cache.close = () => {
        server.close();
        middleware.close();
      };
    },
  };

  return cache;
};
