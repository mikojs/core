// @flow

import { type Middleware as koaMiddlewareType } from 'koa';
import Router from 'koa-router';

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
export default (method: string) => (prefix?: string): returnType => {
  const middlewares = !prefix ? [] : [prefix];
  const router = new Router();

  return {
    routes: () => router.routes(),
    allowedMethods: () => router.allowedMethods(),
    use: (middleware: koaMiddlewareType) => {
      middlewares.push(middleware);
    },
    end: () => {
      router[method === 'start' ? 'use' : method](...middlewares);
    },
  };
};
