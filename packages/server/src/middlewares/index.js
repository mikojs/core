// @flow

import path from 'path';

import debug from 'debug';
import type koaType, { Middleware as koaMiddlewareType } from 'koa';

const debugLog = debug('server:middlewares:default');

/** middlewares controller */
export class Middlewares {
  folderPath = path.resolve('./src/middlewares');

  /**
   * @example
   * middlewares.config('folder path')
   *
   * @param {string} folderPath - folder path
   */
  config = (folderPath: string) => {
    this.folderPath = folderPath;
  };

  /**
   * @example
   * middlewares.use('middleware name')
   *
   * @param {string} middlewareName - middleware name
   *
   * @return {Function} - pipline server function
   */
  use = (middlewareName: string) => (app: koaType): koaType => {
    if (!this.useMiddleware(app, this.folderPath, middlewareName)) {
      if (!this.useMiddleware(app, __dirname, middlewareName))
        throw new Error(
          `can not find \`${middlewareName}\` middleware in ${this.folderPath}`,
        );
    }

    return app;
  };

  /**
   * @example
   * middlewares.useMiddleware(app, 'folder path', 'middleware name')
   *
   * @param {Object} app - koa server
   * @param {string} folderPath - folder path
   * @param {string} middlewareName - middleware name
   *
   * @return {boolean} - use middleware or not
   */
  useMiddleware = (
    app: koaType,
    folderPath: string,
    middlewareName: string,
  ): boolean => {
    const middlewarePath = path.resolve(folderPath, middlewareName);

    debugLog(folderPath, middlewareName);

    try {
      const middlewares = require(middlewarePath);

      debugLog(middlewares);
      if (middlewares instanceof Array)
        middlewares.forEach((middleware: koaMiddlewareType) => {
          app.use(middleware);
        });
      else middlewares(app);

      return true;
    } catch (e) {
      if (!/Cannot find module/.test(e.message)) throw e;

      debugLog(e);
      return false;
    }
  };
}

const middlewares = new Middlewares();
const exportUtils = middlewares.use;

exportUtils.config = middlewares.config;

export default exportUtils;
