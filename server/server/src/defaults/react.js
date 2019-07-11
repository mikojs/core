// @flow

import { emptyFunction } from 'fbjs';

import middleware from './middleware';

/** default react */
export default class React {
  /**
   * @example
   * new DefaultReact('folder path')
   *
   * @param {string} foldePath - folder path
   * @param {object} options - koa-react options
   */
  constructor(foldePath: string, options?: {}) {}

  /**
   * @example
   * defaultReact.buildJs()
   */
  buildJs = emptyFunction;

  /**
   * @example
   * defaultReact.update()
   */
  update = emptyFunction;

  /**
   * @example
   * defaultReact.middleware()
   */
  middleware = emptyFunction.thatReturns(middleware);
}
