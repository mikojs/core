// @flow

import stream, { type Readable as ReadableType } from 'stream';
import crypto from 'crypto';

import { type Context as koaContextType } from 'koa';
import React, { type Node as NodeType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Helmet } from 'react-helmet';

import { type templatesType } from 'utils/getData';

export default async (
  ctx: koaContextType,
  templates: templatesType,
  pageHead: NodeType,
): Promise<$ReadOnlyArray<ReadableType>> => {
  const Document = templates.getDocument();
  const { head, ...initialProps } =
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    (await Document.getInitialProps?.({ ctx, isServer: true })) || {};

  renderToStaticMarkup(
    <>
      {head}
      {pageHead}
    </>,
  );

  const hash = crypto
    .createHmac('sha256', '@cat-org/react-middleware')
    .digest('hex');

  return renderToStaticMarkup(
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
};
