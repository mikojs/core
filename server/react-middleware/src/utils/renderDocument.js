// @flow

import stream, { type Readable as ReadableType } from 'stream';
import crypto from 'crypto';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Helmet } from 'react-helmet';

import templates from 'templates';

export default (): $ReadOnlyArray<ReadableType> => {
  const { Document } = templates;
  const helmet = Helmet.renderStatic();
  const hash = crypto
    .createHmac('sha256', '@cat-org/react-middleware')
    .digest('hex');

  return renderToStaticMarkup(
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
      <main id="__cat__">{hash}</main>
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
};
