// @flow

import EventEmitter from 'events';

import { requireModule } from '@mikojs/utils';

import buildEvents, { type callbackType } from './utils/buildEvents';
import readFiles, {
  type optionsType as readFilesOptionsType,
} from './utils/readFiles';

type middlewareType = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => Promise<void> | void;

type optionsType<C> = {|
  dev: callbackType,
  prod: callbackType,
  build: (cache: C) => middlewareType,
|};

type cacheType = {|
  type?: 'dev' | 'prod',
  callbacks: $ReadOnlyArray<() => Promise<void>>,
  middlewares: { [string]: middlewareType },
|};

type enhancedMiddlewareType = middlewareType & {
  getEvents: (type: $PropertyType<cacheType, 'type'>) => EventEmitter,
  ready: () => Promise<void>,
};

const cache: cacheType = {
  callbacks: [],
  middlewares: {},
};

/**
 * @param {optionsType} options - build middleware options
 *
 * @return {Function} - middleware function
 */
export default <+C>({ dev, prod, build }: optionsType<C>) => (
  config: readFilesOptionsType,
): enhancedMiddlewareType => {
  const cacheId = 'uuid';
  const cachePath = 'todo';

  /**
   * @param {object} req - http request
   * @param {object} res - http response
   */
  const middleware = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    await cache.middlewares[cacheId](req, res);
  };

  /**
   * @param {cacheType} type - cache type
   *
   * @return {buildEvents} - events
   */
  middleware.getEvents = (type: $PropertyType<cacheType, 'type'>) =>
    buildEvents({ dev, prod }[type || 'dev']);

  /**
   * @param {cacheType} type - type for initialize cache type
   */
  middleware.ready = async (type: $PropertyType<cacheType, 'type'>) => {
    cache.type = cache.type || type;
    await Promise.all(
      cache.callbacks.map((callback: () => Promise<void>) => callback()),
    );
  };

  cache.callbacks = [
    ...cache.callbacks,
    () =>
      new Promise(resolve => {
        const events = middleware.getEvents(cache.type);

        readFiles(events, cachePath, config);
        events.on('update-cache', () => {
          cache.middlewares[cacheId] = build(requireModule<C>(cachePath));
        });
        events.on('close', resolve);
      }),
  ];

  return middleware;
};
