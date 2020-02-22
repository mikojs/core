// @flow

import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';
import compose from 'koa-compose';
import mount from 'koa-mount';
import koaStatic from 'koa-static';
import { invariant } from 'fbjs';

import { type webpackMiddlewarweOptionsType } from '../index';

import buildJs from './buildJs';

type ctxType = {
  ...koaContextType,
  state: {
    webpackStats: {
      toJson: () => { assetsByChunkName: { [string]: string } },
    },
  },
};

/**
 * @example
 * buildClient(webpackMiddlewarweOptions)
 *
 * @param {webpackMiddlewarweOptionsType} webpackMiddlewarweOptions - webpack middleware options
 *
 * @return {koaMiddlewareType} - prod client middleware
 */
export default async (
  webpackMiddlewarweOptions: webpackMiddlewarweOptionsType,
): Promise<koaMiddlewareType> => {
  invariant(
    webpackMiddlewarweOptions.config.output?.publicPath &&
      webpackMiddlewarweOptions.config.output?.path,
    'Both of `publicPath`, `path` in `webpackMiddlewarweOptions.config.output` are required',
  );

  const assetsByChunkName = await buildJs(webpackMiddlewarweOptions);

  return compose([
    async (ctx: ctxType, next: () => Promise<void>) => {
      ctx.state.webpackStats = {
        ...ctx.state.webpackStats,
        toJson: () => ({ assetsByChunkName }),
      };
      await next();
    },
    mount(
      // FIXME: invariant should check type
      webpackMiddlewarweOptions.config.output?.publicPath,
      koaStatic(webpackMiddlewarweOptions.config.output?.path),
    ),
  ]);
};
