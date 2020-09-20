// @flow

import { type Server as ServerType } from 'http';

import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import { type callbackType } from './types';
import buildServerWithCli from './buildServerWithCli';

export type fetchResultType = BodyType;

type cacheType = {|
  server?: ServerType,
  port: number,
  close: () => ?ServerType,
  fetch: (pathname: string, options: *) => Promise<BodyType>,
|};

/**
 * @return {cacheType} - testing server object
 */
export default (): ((
  folderPath: string,
  callback: callbackType,
) => Promise<cacheType>) => {
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
  };

  return async (
    folderPath: string,
    callback: callbackType,
  ): Promise<cacheType> => {
    cache.port = await getPort();
    cache.server = await buildServerWithCli(
      '@mikojs/testing-server',
      cache.port,
      ['node', 'server', folderPath],
      callback,
    );

    return cache;
  };
};
