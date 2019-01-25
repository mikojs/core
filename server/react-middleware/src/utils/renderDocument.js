// @flow

import stream, { type Readable as ReadableType } from 'stream';
import crypto from 'crypto';

import { type Context as koaContextType } from 'koa';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Helmet } from 'react-helmet';

import { type templatesType } from './getData';

export default (
  ctx: koaContextType,
  templates: templatesType,
): $ReadOnlyArray<ReadableType> => {
  const Document = templates.getDocument();
  const helmet = Helmet.renderStatic();
  const hash = crypto
    .createHmac('sha256', '@cat-org/react-middleware')
    .digest('hex');

  return renderToStaticMarkup(
    <Document
      {
        // $FlowFixMe Flow does not yet support method or property calls in optional chains.
        ...Document.getInitialProps?.({ ctx, helmet }) || {}
      }
      head={
        <>
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
        </>
      }
      scripts={helmet.script.toComponent()}
    >
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
