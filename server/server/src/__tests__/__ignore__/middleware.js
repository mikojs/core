// @flow

import {
  type ServerResponse as ServerResponseType,
  type IncomingMessage as IncomingMessageType,
} from 'http';

/** @middleware test middleware */
export default (req: IncomingMessageType, res: ServerResponseType) => {
  res.end('test');
};
