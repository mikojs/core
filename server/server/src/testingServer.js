// @flow

import { type Server as ServerType } from 'http';

import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import { type callbackType } from './types';
import buildServer from './buildServer';

export type fetchResultType = BodyType;

type cacheType = {|
  server?: ServerType,
  port: number,
  close: () => ?ServerType,
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
    use: async (folderPath: string) => {
      cache.port = await getPort();
      cache.server = await buildServer(folderPath, cache.port, callback);
    },
  };

  return cache;
};
