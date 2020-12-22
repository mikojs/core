// @flow

import { type Server as ServerType } from 'http';

import fetch, { type Response as ResponseType } from 'node-fetch';
import getPort from 'get-port';

import '@mikojs/merge-dir/lib/testing';
import testingLogger from '@mikojs/logger/lib/testingLogger';

import server, { type middlewareType } from './index';

export type fetchResultType = ResponseType;

const cache: {|
  server?: ServerType,
  port: number,
  close: (callback?: () => void) => ?ServerType,
|} = {
  port: -1,

  /**
   * @param {Function} callback - server callback function
   *
   * @return {ServerType} - server object
   */
  close: (callback?: () => void) => cache.server?.close(callback),
};

export default {
  close: cache.close,

  /**
   * @param {string} pathname - request pathname
   * @param {object} options - request object
   *
   * @return {ResponseType} - request body
   */
  fetch: (pathname: string, options?: *): Promise<fetchResultType> =>
    fetch(`http://localhost:${cache.port}${pathname}`, options),

  /**
   * @param {middlewareType} middleware - middleware function
   */
  run: async <Req = {}, Res = {}>(middleware: middlewareType<Req, Res>) => {
    testingLogger.reset();
    cache.close();
    cache.port = await getPort();
    cache.server = await server.run(middleware, cache.port);
  },
};
