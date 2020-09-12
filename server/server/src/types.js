// @flow

import { type IncomingMessage, type ServerResponse } from 'http';

export type middlewareType = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void;
