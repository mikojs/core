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

import buildMiddleware from './utils/buildMiddleware';

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

/**
 * @param {string} folderPath - folder path
 * @param {string} event - event type
 * @param {callbackType} callback - callback function to handle file
 *
 * @return {middlewareType} - server middleware
 */
export default async (
  folderPath: string,
  event: 'dev' | 'build' | 'start',
  callback: callbackType,
): Promise<middlewareType> => {
  const hash = cryptoRandomString({ length: 10, type: 'base64' });
  const cacheFilePath = cacheDir(`${hash}.js`);

  /** @middleware middleware wrapper */
  const middleware = (req: IncomingMessageType, res: ServerResponseType) => {
    invariant(
      event !== 'build',
      'Should not use the middleware in the build mode',
    );
    requireModule<middlewareType>(cacheFilePath)(req, res);
  };

  if (event !== 'start')
    middleware.cancel = await buildMiddleware(
      folderPath,
      cacheFilePath,
      callback,
    );

  return middleware;
};
