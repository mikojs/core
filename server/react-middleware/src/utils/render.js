/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import stream, { type Readable as ReadableType } from 'stream';
import crypto from 'crypto';

import { type Context as koaContextType } from 'koa';
import React, { type ComponentType } from 'react';
import { renderToStaticMarkup, renderToNodeStream } from 'react-dom/server';
import multistream from 'multistream';
import { emptyFunction } from 'fbjs';
import { Helmet } from 'react-helmet';

export default async (
  ctx: koaContextType,
  Document,
  Container,
  Page,
): multistream => {
  const { head } =
    { ctx, head: null }
    |> (await (Page.getInitialProps || emptyFunction.thatReturnsArgument))
    |> (await (Container.getInitialProps || emptyFunction.thatReturnsArgument));

  renderToStaticMarkup(<Helmet>{head}</Helmet>);

  const helmet = Helmet.renderStatic();
  const hash = crypto
    .createHmac('sha256', '@cat-org/react-middleware')
    .digest('hex');
  const [upperDocument, lowerDocument] = renderToStaticMarkup(
    <Document
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
