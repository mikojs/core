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
import { type watcherType } from './utils/buildWatcher';

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

/**
 * @param {string} foldePath - folder path
 * @param {string} event - event type
 * @param {watcherType} watcher - watcher object
 *
 * @return {middlewareType} - server middleware
 */
export default async (
  foldePath: string,
  event: 'dev' | 'build' | 'start',
  watcher: watcherType,
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

  middleware.close = await mockChoice(
    event !== 'start',
    buildMiddleware,
    emptyFunction.thatReturnsArgument(emptyFunction),
  )(foldePath, watcher, cacheFilePath);

  return middleware;
};
