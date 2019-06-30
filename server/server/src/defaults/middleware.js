// @flow

import { type Context as koaContextType } from 'koa';

export default async (ctx: koaContextType, next: () => Promise<void>) => {
  await next();
};
