// @flow

import { type Middleware as koaMiddlewareType } from 'koa';
import Router from '@koa/router';

export type returnType = {|
  routes: () => koaMiddlewareType,
  allowedMethods: () => koaMiddlewareType,
  use: (middleware: koaMiddlewareType) => void,
  end: () => void,
|};

/**
 * @example
 * buildRouter('start')
 *
 * @param {string} method - method of router
 *
 * @return {Function} - build router function
 */
export default (method: 'start' | 'get' | 'post' | 'put' | 'del' | 'all') => (
  prefix: string,
): returnType => {
  const middlewares = [prefix];
  const router = new Router();

  return {
    routes: () => router.routes(),
    allowedMethods: () => router.allowedMethods(),
    use: (middleware: koaMiddlewareType) => {
      middlewares.push(middleware);
    },
    end: () => {
      switch (method) {
        case 'get':
          router.get(...middlewares);
          break;

        case 'post':
          router.post(...middlewares);
          break;

        case 'put':
          router.put(...middlewares);
          break;

        case 'del':
          router.del(...middlewares);
          break;

        case 'all':
          router.all(...middlewares);
          break;

        default:
          router.use(...middlewares);
          break;
      }
    },
  };
};
