// @flow

import { type Context as koaContextType } from 'koa';
import React from 'react';
import { renderToStaticMarkup, renderToNodeStream } from 'react-dom/server';
import { matchRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import multistream from 'multistream';

import { type routeDataType } from './getRoutesData';
import renderDocument from './renderDocument';

export default (routesData: $ReadOnlyArray<routeDataType>) => async (
  ctx: koaContextType,
  next: () => Promise<void>,
) => {
  const [page] = matchRoutes(
    routesData.map(({ routePath, filePath, chunkName }: routeDataType) => ({
      path: routePath,
      component: {
        filePath,
        chunkName,
      },
      exact: true,
    })),
    ctx.req.url,
  );

  if (!page) {
    await next();
    return;
  }

  const {
    route: {
      component: { filePath, chunkName },
    },
  } = page;

  renderToStaticMarkup(
    <Helmet>
      <script async src="/assets/commons.js" />
      <script async src={`/assets/${chunkName}.js`} />
      <script async src="/assets/client.js" />
    </Helmet>,
  );

  const [upperDocument, lowerDocument] = renderDocument();

  ctx.type = 'text/html; charset=utf-8';
  ctx.body = multistream([
    upperDocument,
    renderToNodeStream(React.createElement(require(filePath))),
    lowerDocument,
  ]);

  await next();
};
