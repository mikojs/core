// @flow

import http, {
  type Server as ServerType,
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import { emptyFunction } from 'fbjs';

import mergeDir, {
  type fileDataType,
  type mergeEventType,
} from '@mikojs/merge-dir';

export type fileType = fileDataType;
export type eventType = mergeEventType;
export type middlewareType<Req = {}, Res = {}> = (
  req: IncomingMessageType & Req,
  res: ServerResponseType & Res,
) => void;

export default {
  set: mergeDir.set,
  ready: mergeDir.ready,
  mergeDir: mergeDir.use,

  /**
   * @param {middlewareType} middleware - middleware function
   * @param {number} port - server port
   * @param {Function} callback - server callback function
   *
   * @return {ServerType} - server object
   */
  run: async (
    middleware: middlewareType<>,
    port: number,
    callback?: () => void = emptyFunction,
  ): Promise<ServerType> => {
    const close = await mergeDir.ready();

    return http
      .createServer(middleware)
      .listen(port, callback)
      .on('close', close);
  },
};
