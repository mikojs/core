// @flow

import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';

import { type optionsType } from '../index';

import { type returnType as buildCompilerReturnType } from './buildCompiler';

type ctxType = {
  ...koaContextType,
  state: {
    commonsUrl: string,
    clientUrl: string,
  },
  res: http$ServerResponse & {
    locals: {
      webpack: {
        devMiddleware: {
          stats: {
            toJson: () => { [string]: string },
          },
        },
      },
    },
  },
};

/**
 * @example
 * buildClient(options, compiler)
 *
 * @param {optionsType} options - koa react options
 * @param {buildCompilerReturnType} compiler - compiler object
 *
 * @return {koaMiddlewareType} - koa middleware
 */
export default (
  { dev = process.env.NODE_ENV !== 'production', basename }: optionsType,
  { compiler, devMiddleware }: buildCompilerReturnType,
) => async (ctx: ctxType, next: () => Promise<void>) => {
  ctx.state.commonsUrl = [basename?.replace(/^\//, ''), 'commons']
    .filter(Boolean)
    .join('/');
  ctx.state.clientUrl = [basename?.replace(/^\//, ''), 'client']
    .filter(Boolean)
    .join('/');

  if (dev && compiler) {
    await new Promise(resolve => {
      require('webpack-dev-middleware')(compiler, devMiddleware)(
        ctx.req,
        ctx.res,
        resolve,
      );
    });

    const assetsByChunkName = ctx.res.locals.webpack.devMiddleware.stats.toJson();

    ctx.state.commonsUrl = assetsByChunkName[ctx.state.commonsUrl];
    ctx.state.clientUrl = assetsByChunkName[ctx.state.clientUrl];
  }
};
