// @flow

import debug from 'debug';
import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';
import React from 'react';

import { requireModule } from '@mikojs/utils';
import server from '@mikojs/react-ssr/lib/server';

import { type optionsType } from '../index';

import { type cacheType } from './getCache';

const debugLog = debug('react:build-server');

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
 * buildServer(options, cache, urls)
 *
 * @param {optionsType} options - koa react options
 * @param {cacheType} cache - cache data
 *
 * @return {koaMiddlewareType} - koa middleware
 */
export default ({ basename }: optionsType, cache: cacheType) => async (
  ctx: ctxType,
  next: () => Promise<void>,
) => {
  debugLog(ctx.path);

  const { assetsByChunkName } = ctx.state.webpackStats.toJson();
  const commonsUrl =
    assetsByChunkName[
      [basename?.replace(/^\//, ''), 'commons'].filter(Boolean).join('/')
    ];
  const clientUrl =
    assetsByChunkName[
      [basename?.replace(/^\//, ''), 'client'].filter(Boolean).join('/')
    ];

  if (commonsUrl === ctx.path) {
    ctx.status = 200;
    ctx.type = 'application/javascript';
    ctx.body = '';
    return;
  }

  if (
    !new RegExp(basename || '').test(ctx.path) ||
    ctx.accepts('html') !== 'html'
  ) {
    await next();
    return;
  }

  ctx.status = 200;
  ctx.type = 'text/html';
  ctx.respond = false;

  (
    await server(
      ctx,
      {
        Document: requireModule(cache.document),
        Main: requireModule(cache.main),
        Error: requireModule(cache.error),
        routesData: cache.routesData.map(
          ({
            filePath,
            ...routeData
          }: $ElementType<$PropertyType<cacheType, 'routesData'>, number>) =>
            routeData,
        ),
      },
      [
        <script key="common" src={commonsUrl} async />,
        <script key="client" src={clientUrl} async />,
      ],
      (errorHtml: string) => {
        ctx.res.end(errorHtml);
      },
    )
  ).pipe(ctx.res);
};
