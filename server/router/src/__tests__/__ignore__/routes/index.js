// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

/** @middleware get middleware */
export default (
  req: IncomingMessageType & {| query: {} |},
  res: ServerResponseType,
) => {
  res.end(`${req.url} ${JSON.stringify(req.query)}`);
};
