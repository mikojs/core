// @flow

import { type Context as koaContextType } from 'koa';

/**
 * @example
 * app.use(middleware)
 *
 * @param {koaContextType} ctx - koa context
 * @param {Promise<>} next - koa next function
 */
export default async (ctx: koaContextType, next: () => Promise<void>) => {
  await next();
};
