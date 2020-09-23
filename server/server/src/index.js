// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import { emptyFunction, invariant } from 'fbjs';
import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';

import { requireModule, mockChoice } from '@mikojs/utils';

import { type middlewareType } from './types';

import buildMiddleware from './utils/buildMiddleware';

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

/**
 * @param {string} foldePath - folder path
 * @param {string} event - event type
 *
 * @return {middlewareType} - server middleware
 */
export default async (
  foldePath: string,
  event: 'dev' | 'build' | 'start',
): Promise<middlewareType> => {
  const hash = cryptoRandomString({ length: 10, type: 'alphanumeric' });
  const cacheFilePath = cacheDir(`${hash}.js`);

  /** @middleware middleware wrapper */
  const middleware = (req: IncomingMessageType, res: ServerResponseType) => {
    invariant(
      event !== 'build',
      'Should not use the middleware in the build mode',
    );
    requireModule<middlewareType>(cacheFilePath)(req, res);
  };

  middleware.unsubscribe = await mockChoice(
    event !== 'start',
    buildMiddleware,
    emptyFunction,
  )(foldePath, cacheFilePath);

  return middleware;
};
