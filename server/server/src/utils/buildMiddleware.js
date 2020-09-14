// @flow

import path from 'path';
import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import chokidar from 'chokidar';
import outputFileSync from 'output-file-sync';

import { requreMoudle } from '@mikojs/utils';

import { type middlewareType } from '../types';

type eventType = 'add' | 'change' | 'unlink';

export type optionsType = {|
  folderPath: string,
  build: (
    event: eventType,
    {|
      filePath: string,
      pathname: string,
    |},
  ) => string,
  ignored?: RegExp,
|};

/**
 * @param {string} cacheFilePath - cache file path
 * @param {optionsType} options - build middleware options
 *
 * @return {middlewareType} - dev middleware
 */
export default (
  cacheFilePath: string,
  { folderPath, build, ...options }: optionsType,
): middlewareType => {
  const watcher = chokidar.watch(folderPath, options);

  ['add', 'change', 'unlink'].forEach((event: eventType) => {
    watcher.on(event, (filePath: string) => {
      outputFileSync(
        cacheFilePath,
        build(event, {
          filePath,
          pathname: path.relative(folderPath, filePath),
        }),
      );
      delete require.cache[filePath];
    });
  });

  return (req: IncomingMessageType, res: ServerResponseType) =>
    requreMoudle<middlewareType>(req, res);
};
