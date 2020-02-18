// @flow

import { type Middleware as koaMiddlewareType } from 'koa';
import Router from 'koa-router';

type returnType = {|
  type: 'router',
  use: (middleware: koaMiddlewareType) => void,
  end: () => $ReadOnlyArray<koaMiddlewareType>,
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

  return {
    type: 'router',
    use: (middleware: koaMiddlewareType) => {
      middlewares.push(middleware);
    },
    end: (): $ReadOnlyArray<koaMiddlewareType> => {
      const router = new Router();

      router[method === 'start' ? 'use' : method](...middlewares);

      return [router.routes(), router.allowedMethods()];
    },
  };
};
