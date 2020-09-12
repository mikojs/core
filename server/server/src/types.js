// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

export type middlewareType = (
  req: IncomingMessageType,
  res: ServerResponseType,
) => Promise<void> | void;
