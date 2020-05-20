// @flow

import http from 'http';

import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import { type middlewareType } from './index';

export type fetchResultType = BodyType;

type cacheType = {|
  port: number,
  server?: http.Server,
  run: (middleware: middlewareType<>) => Promise<void>,
  close: () => ?http.Server,
  fetch: (pathname: string, options: *) => Promise<BodyType>,
|};

/**
 * @return {cacheType} - testing server object
 */
export default (): cacheType => {
  const cache: cacheType = {
    port: -1,
    run: async (middleware: middlewareType<>) => {
      const server = http.createServer(
        (req: http.IncomingMessage, res: http.ServerResponse) => {
          middleware(req, res);
        },
      );

      cache.close();
      cache.port = await getPort();
      cache.server = server.listen(cache.port);
    },
    close: () => cache.server?.close(),
    fetch: (pathname: string, options?: *) =>
      fetch(`http://localhost:${cache.port}${pathname}`, options),
  };

  return cache;
};
