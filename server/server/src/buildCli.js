// @flow

import http from 'http';

import getOptions, { type optionsType } from './utils/getOptions';
import {
  type optionsType as serverOptionsType,
  type middlewareType,
} from './index';

/**
 * @example
 * buildCli(argv, callback)
 *
 * TODO: should use async/await after flow fix error
 *
 * @param {Array} argv - command line
 * @param {Function} callback - use to build the middleware
 *
 * @return {any} - http server
 */
export default <
  C: (folderPath: string, options: serverOptionsType) => middlewareType<>,
>(
  argv: $ReadOnlyArray<string>,
  callback: C,
) =>
  getOptions(argv).then(({ port, folderPath }: optionsType): http.Server => {
    const server = http.createServer(
      callback(folderPath, {
        dev: process.env.NODE_ENV !== 'production',
      }),
    );

    server.listen(port);

    return server;
  });
