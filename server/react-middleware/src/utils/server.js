// @flow

import crypto from 'crypto';
import stream, { type Readable as ReadableType } from 'stream';

import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';
import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import multistream from 'multistream';
import getStream from 'get-stream';

import { lazy, renderToNodeStream } from '../ReactIsomorphic';

import Root from './Root';
import { type dataType } from './getData';

export default (
  basename: ?string,
  { routesData, templates }: dataType,
): koaMiddlewareType => {
  const serverRoutesData = routesData.map(
    ({
      routePath,
      chunkName,
      filePath,
    }: $ElementType<$PropertyType<dataType, 'routesData'>, number>) => ({
      exact: true,
      path: routePath,
      component: {
        loader: async () => ({ default: require(filePath) }),
        chunkName,
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
    if (/\.ico/.test(ctx.path)) {
      await next();
      return;
    }

    ctx.status = 200;
    ctx.type = 'text/html';
    ctx.respond = false;

    const Document = require(templates.document);
    const Main = require(templates.main);
    const Loading = require(templates.loading);
    const ErrorComponent = require(templates.error);
    const { head: documentHead, ...documentInitialProps } =
      // $FlowFixMe Flow does not yet support method or property calls in optional chains.
      (await Document.getInitialProps?.({ ctx, isServer: true })) || {};
    const { head: mainHead, ...mainInitialProps } =
      // $FlowFixMe Flow does not yet support method or property calls in optional chains.
      (await Main.getInitialProps?.({ ctx, isServer: true })) || {};
    const hash = crypto
      .createHmac('sha256', '@cat-org/react-middleware')
      .digest('hex');

    // preload document and main
    renderToStaticMarkup(documentHead || null);
    renderToStaticMarkup(mainHead || null);

    // preload Page
    const store = Root.preload({
      url: '',
      chunkName: '',
      initialProps: {},
      Page: async () => {
        throw new Error('Can not use init Page');
      },
    });
    const { lazyPage } = Root.getPage(serverRoutesData, {
      location: { pathname: ctx.path, search: `?${ctx.querystring}` },
      staticContext: ctx,
    });
    const Page = await lazyPage();

    store.Page = lazy(async () => Page, store.chunkName);

    // preload scripts
    renderToStaticMarkup(
      <Helmet>
        <script>{`var __CAT_DATA__ = ${JSON.stringify({
          ...store,
          Page: null,
          mainInitialProps,
        })};`}</script>
        <script src={commonsUrl} async />
        <script src={`/assets${basename || ''}/client.js`} async />
      </Helmet>,
    );

    // make document scream
    const [upperDocument, lowerDocument] = renderToStaticMarkup(
      <Document {...documentInitialProps} helmet={Helmet.renderStatic()}>
        <main id="__CAT__">{hash}</main>
      </Document>,
    )
      .split(hash)
      .map(
        (docmentText: string): ReadableType => {
          const docmentStream = new stream.Readable();

          docmentStream.push(docmentText);
          docmentStream.push(null);

          return docmentStream;
        },
      );

    // render page
    multistream([
      upperDocument,
      await renderToNodeStream(
        <Router location={ctx.url} context={ctx}>
          <Root
            Main={Main}
            Loading={Loading}
            Error={ErrorComponent}
            routesData={serverRoutesData}
            mainInitialProps={mainInitialProps}
          />
        </Router>,
      ),
      lowerDocument,
    ])
      .on('error', async (error: Error) => {
        ctx.res.end(
          `${renderToString(
            <ErrorComponent error={error} errorInfo={{ componentStack: '' }} />,
          )}${await getStream(lowerDocument)}`,
        );
      })
      .pipe(ctx.res);
  };
};
