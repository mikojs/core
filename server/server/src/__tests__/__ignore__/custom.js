// @flow

import { type Context as koaContextType } from 'koa';

export default async (ctx: koaContextType, next: () => Promise<void>) => {
  ctx.body = ['custom middleware'];
  await next();
};
