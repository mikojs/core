// @flow

import { emptyFunction } from 'fbjs';

import middleware from './middleware';

/** default graphql */
export default class Graphql {
  /**
   * @example
   * new DefaultGraphql('folder path')
   *
   * @param {string} foldePath - folder path
   * @param {object} options - koa-graphql options
   */
  constructor(foldePath: string, options?: {}) {}

  /**
   * @example
   * defaultGraphql.relay()
   */
  relay = emptyFunction;

  /**
   * @example
   * defaultGraphql.update()
   */
  update = emptyFunction;

  /**
   * @example
   * defaultGraphql.middleware()
   */
  middleware = emptyFunction.thatReturns(middleware);
}
