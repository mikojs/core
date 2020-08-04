// @flow

export type middlewareType = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => Promise<void> | void;
