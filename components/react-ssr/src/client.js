// @flow

import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Root, { type propsType } from './index';

/**
 * @example
 * client({ Main, Loading, Error, routesData })
 *
 * @param {propsType} options - components and routes data
 */
export default async ({
  Main,
  Loading,
  Error: ErrorComponent,
  routesData,
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
    routesData.find(
      ({
        component: { chunkName: componentChunkName },
      }: $ElementType<$PropertyType<propsType, 'routesData'>, number>) =>
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
        routesData={routesData}
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
