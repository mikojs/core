// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

export type dataType = {|
  filePath: string,
  exists: boolean,
  pathname: string,
|};

export type callbackType = (file: dataType) => string;

export type middlewareType = (
  req: IncomingMessageType,
  res: ServerResponseType,
) => void;
