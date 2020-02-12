// @flow

import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';

export default (jest
  .fn()
  .mockResolvedValue(async (ctx: koaContextType, next: () => Promise<void>) => {
    ctx.state.webpackStats = {
      ...ctx.state.webpackStats,
      toJson: () => ({
        assetsByChunkName: {
          commons: '/commons',
          client: '/client',
        },
      }),
    };
    await next();
  }): JestMockFn<$ReadOnlyArray<void>, Promise<koaMiddlewareType>>);
