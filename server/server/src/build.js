// @flow

import EventEmitter from 'events';

import { emptyFunction } from 'fbjs';
import findCacheDir from 'find-cache-dir';

import { requireModule } from '@mikojs/utils';

import buildEvents, { type callbackType } from './utils/buildEvents';
import readFiles, {
  type optionsType as readFilesOptionsType,
} from './utils/readFiles';

import { type middlewareType } from './types';

type optionsType<C> = {|
  dev: callbackType,
  prod: callbackType,
  build: (cache: C) => middlewareType,
|};

type configType = {|
  ...readFilesOptionsType,
  key?: string,
|};

type serverEventType = 'dev' | 'prod' | 'start';

type cacheType = {|
  isInitialized: boolean,
  callbacks: $ReadOnlyArray<(serverEvent: serverEventType) => Promise<void>>,
  middlewares: { [string]: middlewareType },
|};

type enhancedMiddlewareType = middlewareType & {
  getEvents: (serverEvent: serverEventType) => EventEmitter,
  ready: (serverEvent: serverEventType) => Promise<void>,
};

const cacheDir = findCacheDir({ name: 'mikojs', thunk: true });
const cache: cacheType = {
  isInitialized: false,
  callbacks: [],
  middlewares: {},
};

/**
 * @param {optionsType} options - build middleware options
 *
 * @return {Function} - middleware function
 */
export default <+C>({ dev, prod, build }: optionsType<C>) => ({
  key = build.name,
  ...config
}: configType): enhancedMiddlewareType => {
  const cachePath = cacheDir(key);

  /**
   * @param {object} req - http request
   * @param {object} res - http response
   */
  const middleware = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    await cache.middlewares[key](req, res);
  };

  /**
   * @param {serverEventType} serverEvent - server event
   *
   * @return {buildEvents} - events
   */
  const getEvents = (serverEvent: serverEventType) =>
    buildEvents({ dev, prod, start: emptyFunction }[serverEvent]);

  /** */
  const buildMiddleware = () => {
    cache.middlewares[key] = build(requireModule<C>(cachePath));
  };

  /**
   * @param {serverEventType} serverEvent - server event
   */
  const ready = async (serverEvent: serverEventType) => {
    if (!cache.isInitialized) cache.isInitialized = true;
    else throw new Error('Can not initialize middlewares twice');

    if (serverEvent === 'start') buildMiddleware();
    else
      await Promise.all(
        cache.callbacks.map(
          (
            callback: $ElementType<
              $PropertyType<cacheType, 'callbacks'>,
              number,
            >,
          ) => callback(serverEvent),
        ),
      );
  };

  middleware.getEvents = getEvents;
  middleware.ready = ready;
  cache.callbacks = [
    ...cache.callbacks,
    (serverEvent: serverEventType) =>
      new Promise(resolve => {
        const events = getEvents(serverEvent);

        readFiles(events, cachePath, config);
        events.on('update-cache', buildMiddleware);
        events.on('close', resolve);
      }),
  ];

  return middleware;
};
