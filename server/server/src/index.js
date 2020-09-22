// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import { invariant } from 'fbjs';
import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';

import { requireModule } from '@mikojs/utils';

import { type callbackType, type middlewareType } from './types';

import eventType from './utils/eventType';
import buildMiddleware from './utils/buildMiddleware';

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

/**
 * @param {string} folderPath - folder path
 * @param {callbackType} callback - callback function to handle file
 *
 * @return {middlewareType} - server middleware
 */
export default async (
  folderPath: string,
  callback: callbackType,
): Promise<middlewareType> => {
  const hash = cryptoRandomString({ length: 10, type: 'base64' });
  const cacheFilePath = cacheDir(`${hash}.js`);

  /** @middleware middleware wrapper */
  const middleware = (req: IncomingMessageType, res: ServerResponseType) => {
    invariant(
      eventType.get() !== 'build',
      'Should not use the middleware in the build mode',
    );
    requireModule<middlewareType>(cacheFilePath)(req, res);
  };

  if (eventType.get() !== 'start')
    middleware.cancel = await buildMiddleware(
      folderPath,
      cacheFilePath,
      callback,
    );

  return middleware;
};
