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
  build: (type: $PropertyType<contextType, 'type'>) => EventEmitter,
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
  /**
   * @param {object} req - http request
   * @param {object} res - http response
   */
  const enhancedMiddleware = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    await middleware(req, res);
  };

  /**
   * @param {contextType} type - context type
   *
   * @return {buildEvents} - events
   */
  const build = (type: $PropertyType<contextType, 'type'>) =>
    buildEvents({ dev, prod }[type || 'dev']);

  /**
   * @param {contextType} type - type for initialize context type
   */
  const ready = async (type: $PropertyType<contextType, 'type'>) => {
    context.type = context.type || type;
    await Promise.all(
      context.callbacks.map((callback: () => Promise<void>) => callback()),
    );
  };

  context.callbacks = [
    ...context.callbacks,
    () =>
      new Promise(resolve => {
        const events = build(context.type);

        readFiles(events, config);
        events.on('close', resolve);
      }),
  ];
  enhancedMiddleware.build = build;
  enhancedMiddleware.ready = ready;

  return enhancedMiddleware;
};
