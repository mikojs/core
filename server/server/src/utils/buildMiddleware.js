// @flow

import path from 'path';
import http from 'http';

import chokidar from 'chokidar';

type eventType = 'add' | 'change' | 'unlink';

export type middlewareType = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => Promise<void> | void;

export type optionsType = {|
  folderPath: string,
  build: (
    event: eventType,
    {|
      filePath: string,
      pathname: string,
    |},
  ) => middlewareType,
  ignored?: RegExp,
|};

/**
 * @param {optionsType} options - build middleware options
 *
 * @return {middlewareType} - dev middleware
 */
export default ({
  folderPath,
  build,
  ...options
}: optionsType): middlewareType => {
  const watcher = chokidar.watch(folderPath, options);
  let middleware: middlewareType;

  ['add', 'change', 'unlink'].forEach((event: eventType) => {
    watcher.on(event, (filePath: string) => {
      middleware = build(event, {
        filePath,
        pathname: path.relative(folderPath, filePath),
      });
    });
  });

  return async (req: http.IncomingMessage, res: http.ServerResponse) => {
    await middleware(req, res);
  };
};
