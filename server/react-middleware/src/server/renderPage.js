// @flow

import { type Context as koaContextType } from 'koa';
import React, { type ComponentType } from 'react';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import multistream from 'multistream';
import getStream from 'get-stream';

import { type ctxType } from '../types';

import renderDocument from './renderDocument';

import { type dataType, type routeDataType } from 'utils/getData';

export default (
  basename: ?string,
  { routesData, templates }: dataType,
) => async (ctx: koaContextType, next: () => Promise<void>) => {
  const commonsUrl = `/assets${basename || ''}/commons.js`;

  if (commonsUrl === ctx.path) {
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
    ctx.path,
  );

  if (!page) {
    // TODO: just for html
    await next();
    return;
  }

  ctx.status = 200;
  ctx.type = 'text/html';
  ctx.respond = false;

  const {
    route: {
      component: { filePath, chunkName },
    },
  } = page;
  const Component: ComponentType<*> & {
    getInitialProps?: (ctxType<>) => Promise<{}>,
  } = require(filePath);
  const Main = templates.getMain();
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

  multistream([
    upperDocument,
    renderToNodeStream(
      <Router location={ctx.url} context={{}}>
        <Main>
          <Component {...initialProps} />
        </Main>
      </Router>,
    ),
    lowerDocument,
  ])
    .on('error', async (error: Error) => {
      const ErrorComponent = templates.getError();

      ctx.res.end(
        `${renderToString(
          <ErrorComponent error={error} errorInfo={{ componentStack: '' }} />,
        )}${await getStream(lowerDocument)}`,
      );
    })
    .pipe(ctx.res);
};
