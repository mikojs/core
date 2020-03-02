// @flow

import debug from 'debug';
import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';
import React, { type ComponentType } from 'react';

import { requireModule } from '@mikojs/utils';
import {
  type documentComponentType,
  type mainComponentType,
  type errorComponentPropsType,
} from '@mikojs/react-ssr';
import server from '@mikojs/react-ssr/lib/server';

import { type optionsType } from '../index';

import { type cacheType } from './buildCache';

const debugLog = debug('react:buildServer');

export type ctxType = {
  ...koaContextType,
  state: {
    commonsUrl: string,
    clientUrl: string,
  },
};

/**
 * @example
 * buildServer(options, cache)
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

  if (ctx.state.commonsUrl === ctx.path) {
    ctx.status = 200;
    ctx.type = 'application/javascript';
    ctx.body = '';
    return;
  }

  if (ctx.accepts('html') !== 'html') {
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
        Document: requireModule<documentComponentType<*>>(cache.document),
        Main: requireModule<mainComponentType<*, *>>(cache.main),
        Error: requireModule<ComponentType<errorComponentPropsType>>(
          cache.error,
        ),
        routesData: cache.routesData.map(
          ({
            filePath,
            ...routeData
          }: $ElementType<$PropertyType<cacheType, 'routesData'>, number>) =>
            routeData,
        ),
      },
      [
        <script key="commons" src={ctx.state.commonsUrl} async />,
        <script key="client" src={ctx.state.clientUrl} async />,
      ],
      (errorHtml: string) => {
        ctx.res.end(errorHtml);
      },
    )
  ).pipe(ctx.res);
};
