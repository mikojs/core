// @flow

import path from 'path';

import debug from 'debug';
import type koaType from 'koa';

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
   * @param {Any} options - middleware options
   *
   * @return {Function} - pipline server function
   */
  use = <optionsType>(middlewareName: string, options?: optionsType) => (
    app: koaType,
  ): koaType => {
    if (!this.useMiddleware(app, this.folderPath, middlewareName, options)) {
      if (!this.useMiddleware(app, __dirname, middlewareName, options))
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
   * @param {Any} options - middleware options
   *
   * @return {boolean} - use middleware or not
   */
  useMiddleware = <optionsType>(
    app: koaType,
    folderPath: string,
    middlewareName: string,
    options?: optionsType,
  ): boolean => {
    const middlewarePath = path.resolve(folderPath, middlewareName);

    debugLog(folderPath, middlewareName);

    try {
      const middleware = require(middlewarePath);

      app.use(folderPath === __dirname ? middleware(options) : middleware);

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
