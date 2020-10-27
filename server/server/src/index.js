// @flow

import http, {
  type Server as ServerType,
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import { emptyFunction } from 'fbjs';

import mergeDir, {
  type fileDataType as mergeDirFileDataType,
  type mergeEventType,
} from '@mikojs/merge-dir';

export type fileDataType = mergeDirFileDataType;
export type eventType = mergeEventType;
export type middlewareType<Req = {}, Res = {}> = (
  req: IncomingMessageType & Req,
  res: ServerResponseType & Res,
) => void | Promise<void>;

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
      .createServer((req: IncomingMessageType, res: ServerResponseType) => {
        middleware(req, res);
      })
      .listen(port, callback)
      .on('close', close);
  },
};
