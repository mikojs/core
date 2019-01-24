// @flow

import { type Context as koaContextType } from 'koa';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter as Router, Route } from 'react-router-dom';

import { type routeDataType } from './getRoutesData';
import { getRoutes } from './Root';

export default (routesData: $ReadOnlyArray<routeDataType>) => async (
  ctx: koaContextType,
  next: () => Promise<void>,
) => {
  ctx.type = 'text/html; charset=utf-8';
  // TODO: render not found
  ctx.body = renderToNodeStream(
    <>
      <main id="__cat__">
        <Router location={ctx.req.url} context={{}}>
          {getRoutes(
            routesData.map(
              ({ routePath, chunkName, filePath }: routeDataType) => ({
                routePath,
                chunkName,
                component: require(filePath),
              }),
            ),
          )}
        </Router>
      </main>
      <script async src="/assets/commons.js" />
      <Router location={ctx.req.url} context={{}}>
        {routesData.map(({ routePath, chunkName }: routeDataType) => (
          <Route
            key={chunkName}
            path={routePath}
            component={() => <script async src={`/assets/${chunkName}.js`} />}
            exact
          />
        ))}
      </Router>
      <script async src="/assets/client.js" />
    </>,
  );

  await next();
};
