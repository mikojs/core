// @flow

import crypto from 'crypto';
import stream, { type Readable as ReadableType } from 'stream';

import debug from 'debug';
import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';
import React from 'react';
import {
  renderToStaticMarkup,
  renderToString,
  renderToNodeStream as reactServerRender,
} from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import multistream from 'multistream';
import getStream from 'get-stream';
import { emptyFunction } from 'fbjs';

import { requireModule } from '@cat-org/utils';

import { lazy, renderToNodeStream } from '../ReactIsomorphic';

import PagesHelper from './PagesHelper';
import Root from './Root';
import type CacheType from './Cache';
import { type preloadType } from './client';

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
  // preload Page
  const pagesHelper = new PagesHelper(cache.routesData);

  pagesHelper.getPage({
    location: { pathname: ctx.path, search: `?${ctx.querystring}` },
    staticContext: ctx,
  });

  const Page = await pagesHelper.lazyPage();

  pagesHelper.Page = lazy(async () => Page, pagesHelper.chunkName);

  // preload Document and Main
  const initialProps = {
    ...pagesHelper.initialProps,
    head: undefined,
  };
  const { head: documentHead, ...documentInitialProps } =
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    (await Document.getInitialProps?.({ ctx, isServer: true })) || {};
  const { head: mainHead, ...mainInitialProps } =
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    (await Main.getInitialProps?.({
      ctx,
      isServer: true,
      Component: pagesHelper.Component,
      pageProps: initialProps,
    })) || {};

  debugLog({
    initialProps,
    documentInitialProps,
    mainInitialProps,
  });

  // preload scripts
  renderToStaticMarkup(documentHead || null);
  renderToStaticMarkup(mainHead || null);
  renderToStaticMarkup(pagesHelper.initialProps.head || null);
  renderToStaticMarkup(
    <Helmet>
      <script>{`var __CAT_DATA__ = ${JSON.stringify(
        ({
          originalUrl: pagesHelper.originalUrl,
          chunkName: pagesHelper.chunkName,
          initialProps,
          mainInitialProps,
        }: preloadType),
      )};`}</script>
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
  multistream([
    upperDocument,
    await renderToNodeStream(
      <Router location={ctx.url} context={{ ...ctx, url: undefined }}>
        <Root
          Main={Main}
          Loading={emptyFunction.thatReturnsNull}
          Error={ErrorComponent}
          pagesHelper={pagesHelper}
          mainInitialProps={{
            ...mainInitialProps,
            Component: pagesHelper.Component,
          }}
        />
      </Router>,
      { stream, reactServerRender },
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
