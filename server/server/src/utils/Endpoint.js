// @flow

import type { Middleware as koaMiddlewareType } from 'koa';
import debug from 'debug';

const debugLog = debug('server:endpoint');

/** router endpoint */
export default class Endpoint {
  -urlPattern: string;

  -method: string;

  // middlewares can be modified in Endpoint
  // eslint-disable-next-line flowtype/no-mutable-array
  +middlewares: Array<koaMiddlewareType>;

  /**
   * @example
   * new Endpoint('/test', 'get')
   *
   * @param {string} urlPattern - url pattern
   * @param {string} method - method of endpoint
   */
  constructor(urlPattern: string, method: string) {
    debugLog({ urlPattern, method });
    this.urlPattern = urlPattern;
    this.method = method;
    this.middlewares = [];
  }

  /**
   * @example
   * endpoint.use(async (ctx, next) => { })
   *
   * @param {Object} middleware - koa middleware
   */
  +use = (middleware: koaMiddlewareType) => {
    this.middlewares.push(middleware);
  };
}
