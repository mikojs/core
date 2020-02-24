// @flow

import path from 'path';

import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';
import compose from 'koa-compose';
import { invariant } from 'fbjs';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

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
  let commonsUrl: string = [basename?.replace(/^\//, ''), 'commons']
    .filter(Boolean)
    .join('/');
  let clientUrl: string = [basename?.replace(/^\//, ''), 'client']
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

  const { publicPath, path: folderPath } = config.output || {};

  invariant(
    publicPath && folderPath,
    '`publicPath` and `folderPath` is required in webpack config.output',
  );
  d3DirTree(folderPath, {
    extensions: /\.js$/,
  })
    .leaves()
    .forEach(({ data: { name, path: filePath } }: d3DirTreeNodeType) => {
      if (new RegExp(commonsUrl).test(name))
        commonsUrl = path.relative(folderPath, filePath);

      if (new RegExp(clientUrl).test(name))
        clientUrl = path.relative(folderPath, filePath);
    });

  return compose([
    async (ctx: ctxType, next: () => Promise<void>) => {
      ctx.state.commonsUrl = commonsUrl;
      ctx.state.clientUrl = clientUrl;

      await next();
    },
    require('koa-mount')(publicPath, require('koa-static')(folderPath)),
  ]);
};
