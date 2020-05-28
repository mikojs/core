// @flow

import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { type routeType } from './utils/getPage';

import Root, { type propsType } from './index';

/**
 * @param {propsType} options - components and routes array
 */
export default async ({
  Main,
  Loading,
  Error: ErrorComponent,
  routes,
}: $Diff<propsType, {| initialState: mixed |}>) => {
  const {
    mainInitialProps,
    pageInitialProps,
    chunkName,
  } = window.__MIKOJS_DATA__;

  // preload page
  const {
    component: { loader },
  } =
    routes.find(
      ({ component: { chunkName: componentChunkName } }: routeType) =>
        chunkName === componentChunkName,
    ) ||
    (() => {
      throw new Error('Can not find page component');
    })();
  const { default: InitialPage } = await loader();

  // render
  hydrate(
    <Router>
      <Root
        Main={Main}
        Loading={Loading}
        Error={ErrorComponent}
        routes={routes}
        initialState={{
          Page: InitialPage,
          mainProps: mainInitialProps,
          pageProps: pageInitialProps,
        }}
      />
    </Router>,
    document.getElementById('__MIKOJS__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })(),
  );
};
