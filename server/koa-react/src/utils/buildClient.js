// @flow

import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';
import compose from 'koa-compose';

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
  { compiler, config, devMiddleware }: buildCompilerReturnType,
): koaMiddlewareType => {
  const commonsUrl = [basename?.replace(/^\//, ''), 'commons']
    .filter(Boolean)
    .join('/');
  const clientUrl = [basename?.replace(/^\//, ''), 'client']
    .filter(Boolean)
    .join('/');

  if (dev)
    // $FlowFixMe TODO: can not extend koa context type
    return async (ctx: ctxType, next: () => Promise<void>) => {
      if (compiler) {
        await new Promise(resolve => {
          require('webpack-dev-middleware')(compiler, devMiddleware)(
            ctx.req,
            ctx.res,
            resolve,
          );
        });

        const assetsByChunkName = ctx.res.locals.webpack.devMiddleware.stats.toJson();

        ctx.state.commonsUrl = assetsByChunkName[commonsUrl];
        ctx.state.clientUrl = assetsByChunkName[clientUrl];
      } else {
        ctx.state.commonsUrl = commonsUrl;
        ctx.state.clientUrl = clientUrl;
      }

      await next();
    };

  return compose([
    require('koa-mount')(
      config.output?.publicPath,
      require('koa-static')(config.output?.path),
    ),
  ]);
};
