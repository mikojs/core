// @flow

import { type Context as koaContextType } from 'koa';
import React, { type ElementType } from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import multistream from 'multistream';

import renderDocument from './renderDocument';

import { type dataType, type routeDataType } from 'utils/getData';

type ctxType = {|
  isServer: true,
  ctx: koaContextType,
|};

export default (
  basename: ?string,
  { routesData, templates }: dataType,
) => async (ctx: koaContextType, next: () => Promise<void>) => {
  const commonsUrl = `/assets${basename || ''}/commons.js`;

  if (commonsUrl === ctx.url) {
    ctx.status = 200;
    ctx.type = 'application/javascript';
    ctx.body = '';
    return;
  }

  const [page] = matchRoutes(
    routesData.map(({ routePath, filePath, chunkName }: routeDataType) => ({
      path: routePath,
      component: {
        filePath,
        chunkName,
      },
      exact: true,
    })),
    ctx.url,
  );

  if (!page) {
    // TODO: add templates
    await next();
    return;
  }

  const {
    route: {
      component: { filePath, chunkName },
    },
  } = page;
  const Component: ElementType & {
    getInitialProps?: ctxType => Promise<{}>,
  } = require(filePath);
  const { head, ...initialProps } =
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    (await Component.getInitialProps?.({ ctx, isServer: true })) || {};

  const [upperDocument, lowerDocument] = await renderDocument(
    ctx,
    templates,
    <>
      {head}

      <Helmet>
        <script>{`var __CAT_DATA__ = ${JSON.stringify(initialProps)};`}</script>
        <script async src={commonsUrl} />
        <script async src={`/assets/${chunkName}.js`} />
        <script async src={`/assets${basename || ''}/client.js`} />
      </Helmet>
    </>,
  );

  ctx.type = 'text/html';
  ctx.body = multistream([
    upperDocument,
    renderToNodeStream(
      <Router location={ctx.url} context={{}}>
        <Component {...initialProps} />
      </Router>,
    ),
    lowerDocument,
  ]);

  await next();
};
