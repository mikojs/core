// @flow

import crypto from 'crypto';
import stream, { type Readable as ReadableType } from 'stream';

import debug from 'debug';
import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';
import React from 'react';
import { isMemo } from 'react-is';
import {
  renderToStaticMarkup,
  renderToString,
  renderToNodeStream,
} from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Multistream from 'multistream';
import getStream from 'get-stream';
import { emptyFunction } from 'fbjs';

import { requireModule } from '@cat-org/utils';

import type CacheType from './Cache';

import Root from 'components/Root';
import getPage from 'components/getPage';

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

  const Document = requireModule(cache.document);
  const Main = requireModule(cache.main);
  const ErrorComponent = requireModule(cache.error);

  // [start] preload
  // preload Document, Main, Page
  const { head: documentHead, ...documentInitialProps } =
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    (await (!isMemo(Document) ? Document : Document.type).getInitialProps?.({
      ctx,
      isServer: true,
    })) || {};
  renderToStaticMarkup(documentHead || null);

  const {
    Page: InitialPage,
    mainProps: mainInitialProps,
    pageProps: pageInitialProps,
    chunkName,
  } = await getPage(Main, cache.routesData, ctx, true);

  debugLog({
    documentInitialProps,
    mainInitialProps,
    pageInitialProps,
    chunkName,
  });

  // preload scripts
  renderToStaticMarkup(
    <Helmet>
      <script>{`var __CAT_DATA__ = ${JSON.stringify({
        mainInitialProps,
        pageInitialProps,
        chunkName,
      })};`}</script>
      <script src={commonsUrl} async />
      <script src={clientUrl} async />
    </Helmet>,
  );
  // [end] preload

  // make document scream
  const hash = crypto.createHmac('sha256', '@cat-org/koa-react').digest('hex');
  const [upperDocument, lowerDocument] = renderToStaticMarkup(
    <Document {...documentInitialProps} helmet={Helmet.renderStatic()}>
      <main id="__CAT__">{hash}</main>
    </Document>,
  )
    .split(hash)
    .map((docmentText: string): ReadableType => {
      const docmentStream = new stream.Readable();

      docmentStream.push(docmentText);
      docmentStream.push(null);

      return docmentStream;
    });

  // render page
  new Multistream([
    upperDocument,
    renderToNodeStream(
      <Router location={ctx.url} context={{}}>
        <Root
          Main={Main}
          Loading={emptyFunction.thatReturnsNull}
          Error={ErrorComponent}
          routesData={cache.routesData}
          InitialPage={InitialPage}
          mainInitialProps={mainInitialProps}
          pageInitialProps={pageInitialProps}
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
