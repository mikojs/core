// @flow

import debug from 'debug';
import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';
import React from 'react';

import { requireModule } from '@mikojs/utils';
import server from '@mikojs/react-ssr/lib/server';

import type CacheType from './Cache';

const debugLog = debug('react:server');

/**
 * @example
 * server('/', data, {})
 *
 * @param {string} basename - basename to join urls path
 * @param {CacheType} cache - cache data
 * @param {object} urls - urls data
 *
 * @return {koaMiddlewareType} - koa middleware
 */
export default (
  basename: ?string,
  cache: CacheType,
  { clientUrl, commonsUrl }: { [string]: string },
) => async (ctx: koaContextType, next: () => Promise<void>) => {
  debugLog(ctx.path);

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
        routesData: cache.routesData,
      },
      <>
        <script src={commonsUrl} async />
        <script src={clientUrl} async />
      </>,
      ctx.res.end,
    )
  ).pipe(ctx.res);
};
