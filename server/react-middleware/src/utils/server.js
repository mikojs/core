// @flow

import crypto from 'crypto';
import stream, { type Readable as ReadableType } from 'stream';

import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';
import React from 'react';
import {
  renderToStaticMarkup,
  renderToString,
  renderToNodeStream,
} from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import multistream from 'multistream';
import getStream from 'get-stream';

import Root from './Root';
import { preloadAll } from './ReactIsomorphic';

import { type dataType } from 'utils/getData';

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

    // preload document
    renderToStaticMarkup(documentHead || null);
    renderToStaticMarkup(mainHead || null);
    // preload page
    await Root.getPage(serverRoutesData, {
      location: { pathname: ctx.path, search: `?${ctx.querystring}` },
      staticContext: ctx,
    });
    await preloadAll();

    // add scripts
    const initialProps = Root.preload();

    renderToStaticMarkup(
      <Helmet>
        <script>{`var __CAT_DATA__ = ${JSON.stringify({
          ...initialProps,
          mainInitialProps,
        })};`}</script>
        <script async src={commonsUrl} />
        <script async src={`/assets/${initialProps.chunkName}.js`} />
        <script async src={`/assets${basename || ''}/client.js`} />
      </Helmet>,
    );

    // make document scream
    const [upperDocument, lowerDocument] = renderToStaticMarkup(
      <Document {...documentInitialProps} helmet={Helmet.renderStatic()}>
        <main id="__cat__">{hash}</main>
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
      renderToNodeStream(
        <Router location={ctx.url} context={ctx}>
          <Root
            Main={Main}
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
