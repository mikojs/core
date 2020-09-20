// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';

import { requireModule } from '@mikojs/utils';

import { type callbackType } from './utils/buildMiddleware';

export type middlewareType = (
  req: IncomingMessageType,
  res: ServerResponseType,
) => Promise<void> | void;

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

/**
 * @param {string} folderPath - folder path
 * @param {callbackType} callback - callback function to handle file
 *
 * @return {middlewareType} - server middleware
 */
export default (folderPath: string, callback: callbackType): middlewareType => {
  const hash = cryptoRandomString({ length: 10, type: 'base64' });
  const cacheFilePath = cacheDir(`${hash}.js`);

  return (req: IncomingMessageType, res: ServerResponseType) =>
    requireModule<middlewareType>(cacheFilePath)(req, res);
};
