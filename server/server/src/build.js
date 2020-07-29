// @flow

import EventEmitter from 'events';

import buildEvents, { type callbackType } from './utils/buildEvents';
import readFiles, {
  type optionsType as readFilesOptionsType,
} from './utils/readFiles';

type middlewareType = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => Promise<void> | void;

type optionsType = {|
  dev: callbackType,
  prod: callbackType,
  middleware: middlewareType,
|};

type contextType = {|
  type?: 'dev' | 'prod',
  callbacks: $ReadOnlyArray<() => Promise<void>>,
|};

type enhancedMiddlewareType = middlewareType & {
  getEvents: (type: $PropertyType<contextType, 'type'>) => EventEmitter,
  ready: () => Promise<void>,
};

const context: contextType = {
  callbacks: [],
};

/**
 * @param {optionsType} options - build middleware options
 *
 * @return {Function} - middleware function
 */
export default ({ dev, prod, middleware }: optionsType) => (
  config: readFilesOptionsType,
): enhancedMiddlewareType => {
  const cacheDir = 'todo';
  const cache = {
    middleware: async (req: http.IncomingMessage, res: http.ServerResponse) => {
      await middleware(req, res);
    },

    getEvents: (type: $PropertyType<contextType, 'type'>) =>
      buildEvents({ dev, prod }[type || 'dev']),

    ready: async (type: $PropertyType<contextType, 'type'>) => {
      context.type = context.type || type;
      await Promise.all(
        context.callbacks.map((callback: () => Promise<void>) => callback()),
      );
    },
  };

  context.callbacks = [
    ...context.callbacks,
    () =>
      new Promise(resolve => {
        const events = cache.getEvents(context.type);

        readFiles(events, cacheDir, config);
        events.on('close', resolve);
      }),
  ];
  cache.middleware.getEvents = cache.getEvents;
  cache.middleware.ready = cache.ready;

  return cache.middleware;
};
