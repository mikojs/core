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

type contextType = {|
  type?: 'dev' | 'prod',
  callbacks: $ReadOnlyArray<() => Promise<void>>,
  middlewares: { [string]: middlewareType },
|};

type enhancedMiddlewareType = middlewareType & {
  getEvents: (type: $PropertyType<contextType, 'type'>) => EventEmitter,
  ready: () => Promise<void>,
};

const context: contextType = {
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
    await context.middlewares[cacheId](req, res);
  };

  /**
   * @param {contextType} type - context type
   *
   * @return {buildEvents} - events
   */
  middleware.getEvents = (type: $PropertyType<contextType, 'type'>) =>
    buildEvents({ dev, prod }[type || 'dev']);

  /**
   * @param {contextType} type - type for initialize context type
   */
  middleware.ready = async (type: $PropertyType<contextType, 'type'>) => {
    context.type = context.type || type;
    await Promise.all(
      context.callbacks.map((callback: () => Promise<void>) => callback()),
    );
  };

  context.callbacks = [
    ...context.callbacks,
    () =>
      new Promise(resolve => {
        const events = middleware.getEvents(context.type);

        readFiles(events, cachePath, config);
        events.on('update-cache', () => {
          context.middlewares[cacheId] = build(requireModule<C>(cachePath));
        });
        events.on('close', resolve);
      }),
  ];

  return middleware;
};
