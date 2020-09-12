// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

/**
 * @param {IncomingMessageType} req - http request
 * @param {ServerResponseType} res - http response
 */
export default (req: IncomingMessageType, res: ServerResponseType) => {
  res.end(req.url);
};
