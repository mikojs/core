// @flow

import type koaType, { Context as koaContextType } from 'koa';

export default (app: koaType) => {
  app.use(
    async (ctx: koaContextType, next: () => Promise<void>): Promise<void> => {
      ctx.body = ['custom middleware'];
      await next();
    },
  );
};
