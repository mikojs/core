// @flow

import stream, { type Readable as ReadableType } from 'stream';
import crypto from 'crypto';

import { type Context as koaContextType } from 'koa';
import React from 'react';
import { renderToStaticMarkup, renderToNodeStream } from 'react-dom/server';
import multistream from 'multistream';
import { emptyFunction } from 'fbjs';
import { Helmet } from 'react-helmet';

export default async (
  ctx: koaContextType,
  Document,
  Main,
  Page,
): multistream => {
  const { head = null } =
    (await (Main.getInitialProps || emptyFunction.thatReturnsArgument)({
      ctx,
      Page,
    })) || {};

  renderToStaticMarkup(
    <>
      {head}

      <Helmet>
        <script async src="/assets/index.js" />
      </Helmet>
    </>,
  );

  const helmet = Helmet.renderStatic();
  const hash = crypto
    .createHmac('sha256', '@cat-org/react-middleware')
    .digest('hex');
  const [upperDocument, lowerDocument] = renderToStaticMarkup(
    <Document
      {...(!Document.getInitialProps
        ? null
        : Document.getInitialProps({ ctx, helmet }))}
      head={
        <>
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
        </>
      }
      scripts={helmet.script.toComponent()}
    >
      <main id="__cat">{hash}</main>
    </Document>,
  )
    .split(hash)
    .map(
      (docmentText: string): ReadableType => {
        const docmentStream = new stream.Readable({
          read: () => {},
        });

        docmentStream.push(docmentText);
        docmentStream.push(null);

        return docmentStream;
      },
    );

  return multistream([
    upperDocument,
    renderToNodeStream(<Page />),
    lowerDocument,
  ]);
};
