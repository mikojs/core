// @flow

import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import multistream from 'multistream';

import Root from './Root';
import { preloadAll } from './ReactIsomorphic';

import { type dataType, type routeDataType } from 'utils/getData';

export default (
  basename: ?string,
  { routesData, templates }: dataType,
): koaMiddlewareType => {
  const serverRoutesData = routesData.map(
    ({ routePath, chunkName, filePath }: routeDataType) => ({
      exact: true,
      path: routePath,
      component: {
        loader: async () => ({ default: require(filePath) }),
        moduleId: chunkName,
      },
    }),
  );

  return async (ctx: koaContextType, next: () => Promise<void>) => {
    const commonsUrl = `/assets${basename || ''}/commons.js`;

    if (commonsUrl === ctx.path) {
      ctx.status = 200;
      ctx.type = 'application/javascript';
      ctx.body = '';
      return;
    }

    // TODO: just for html

    ctx.status = 200;
    ctx.type = 'text/html';
    ctx.respond = false;

    await Root.getPage(serverRoutesData, {
      location: { pathname: ctx.path, search: `?${ctx.querystring}` },
      staticContext: ctx,
    });
    await preloadAll();
    // TODO:  Root.preload

    multistream([
      renderToNodeStream(
        <Router location={ctx.url} context={ctx}>
          <Root
            Main={require(templates.main)}
            Error={require(templates.error)}
            routesData={serverRoutesData}
          />
        </Router>,
      ),
    ]).pipe(ctx.res);
  };
};
