// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

export type fileType = {|
  name: string,
  exists: boolean,
  type: 'f',
|};

export type callbackType = (file: fileType) => string;

export type middlewareType = (
  req: IncomingMessageType,
  res: ServerResponseType,
) => void;
