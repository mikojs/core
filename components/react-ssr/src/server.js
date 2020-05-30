// @flow

import crypto from 'crypto';
import stream, { type Readable as ReadableType } from 'stream';

import React, { type Node as NodeType, type ComponentType } from 'react';
import { renderToStaticMarkup, renderToNodeStream } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Multistream from 'multistream';
import { emptyFunction } from 'fbjs';

import Root, { type propsType } from './index';

import getStatic from 'utils/getStatic';
import getPage from 'utils/getPage';

export type documentComponentType<C = {}, P = {}> = ComponentType<P> & {
  getInitialProps?: ({
    ctx: C,
    isServer: boolean,
  }) => P,
};

type optionsType<-C> = {|
  ...$Diff<propsType, {| Loading: mixed, initialState: mixed |}>,
  Document: documentComponentType<C, *>,
|};

/**
 * @param {object} ctx - ctx object
 * @param {optionsType} options - components and routes array
 * @param {NodeType} scripts - scripts dom
 * @param {Function} errorCallback - error callback
 *
 * @return {ReadableType} - rendering stream
 */
export default async <-C>(
  ctx: C & { url: string, pathname: string },
  { Document, Main, Error: ErrorComponent, routes }: optionsType<C>,
  scripts: NodeType,
  errorCallback: (errorHtml: string) => void,
): Promise<ReadableType> => {
  // [start] preload
  // preload Document, Main, Page
  const { head: documentHead, ...documentInitialProps } =
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    (await getStatic(Document).getInitialProps?.({
      ctx,
      isServer: true,
    })) || {};
  renderToStaticMarkup(documentHead || null);

  const {
    Page: InitialPage,
    mainProps: mainInitialProps,
    pageProps: pageInitialProps,
    chunkName,
  } = await getPage(Main, routes, ctx);

  // preload scripts
  renderToStaticMarkup(
    <Helmet>
      <script>{`var __MIKOJS_DATA__ = ${JSON.stringify({
        mainInitialProps,
        pageInitialProps,
        chunkName,
      })};`}</script>

      {scripts}
    </Helmet>,
  );
  // [end] preload

  // make document scream
  const hash = crypto.createHmac('sha256', '@mikojs/react-ssr').digest('hex');
  const [
    [upperDocumentStream],
    [lowerDocumentStream, lowerDocument],
  ] = `<!DOCTYPE html>${renderToStaticMarkup(
    <Document {...documentInitialProps} helmet={Helmet.renderStatic()}>
      <main id="__MIKOJS__">{hash}</main>
    </Document>,
  )}`
    .split(hash)
    .map((docmentText: string): [ReadableType, string] => {
      const docmentStream = new stream.Readable();

      docmentStream.push(docmentText);
      docmentStream.push(null);

      return [docmentStream, docmentText];
    });

  // render page
  return new Multistream([
    upperDocumentStream,
    renderToNodeStream(
      <Router location={ctx.url} context={{}}>
        <Root
          Main={Main}
          Loading={emptyFunction.thatReturnsNull}
          Error={ErrorComponent}
          routes={routes}
          initialState={{
            Page: InitialPage,
            mainProps: mainInitialProps,
            pageProps: pageInitialProps,
          }}
        />
      </Router>,
    ),
    lowerDocumentStream,
  ]).on('error', (error: Error) => {
    errorCallback(
      `${renderToStaticMarkup(
        <ErrorComponent error={error} errorInfo={{ componentStack: '' }} />,
      )}${lowerDocument}`,
    );
  });
};
