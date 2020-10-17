// @flow

import http, {
  type Server as ServerType,
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import { emptyFunction } from 'fbjs';

import mergeDir from '@mikojs/merge-dir';

export type middlewareType = (
  req: IncomingMessageType,
  res: ServerResponseType,
) => void;

export default {
  ready: mergeDir.ready,

  /**
   * @param {middlewareType} middleware - middleware function
   * @param {number} port - server port
   * @param {Function} callback - server callback function
   *
   * @return {ServerType} - server object
   */
  run: async (
    middleware: middlewareType,
    port: number,
    callback?: () => void = emptyFunction,
  ): Promise<ServerType> => {
    const close = await mergeDir.ready();
    const runningServer = http.createServer(middleware).listen(port, callback);

    runningServer.on('close', close);

    return runningServer;
  },
};
