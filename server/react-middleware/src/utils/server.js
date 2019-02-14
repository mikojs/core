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
    if (/\.ico/.test(ctx.path)) {
      await next();
      return;
    }

    ctx.status = 200;
    ctx.type = 'text/html';
    ctx.respond = false;

    const Document = require(templates.document);
    const { head, ...initialProps } =
      // $FlowFixMe Flow does not yet support method or property calls in optional chains.
      (await Document.getInitialProps?.({ ctx, isServer: true })) || {};
    const hash = crypto
      .createHmac('sha256', '@cat-org/react-middleware')
      .digest('hex');

    // preload document
    renderToStaticMarkup(head || null);
    // preload page
    await Root.getPage(serverRoutesData, {
      location: { pathname: ctx.path, search: `?${ctx.querystring}` },
      staticContext: ctx,
    });
    await preloadAll();
    // add scripts
    renderToStaticMarkup(
      <Helmet>
        <script>{`var __CAT_DATA__ = ${JSON.stringify(
          Root.preload(),
        )};`}</script>
      </Helmet>,
    );

    // make document scream
    const [upperDocument, lowerDocument] = renderToStaticMarkup(
      <Document {...initialProps} helmet={Helmet.renderStatic()}>
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
            Main={require(templates.main)}
            Error={require(templates.error)}
            routesData={serverRoutesData}
          />
        </Router>,
      ),
      lowerDocument,
    ])
      .on('error', async (error: Error) => {
        const ErrorComponent = templates.error;

        ctx.res.end(
          `${renderToString(
            <ErrorComponent error={error} errorInfo={{ componentStack: '' }} />,
          )}${await getStream(lowerDocument)}`,
        );
      })
      .pipe(ctx.res);
  };
};
