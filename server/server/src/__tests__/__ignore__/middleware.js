// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

/** @middleware */
export default (req: IncomingMessageType, res: ServerResponseType) => {
  res.end(req.url);
};
