// @flow

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { emptyFunction } from 'fbjs';

import { handleUnhandledRejection } from '@cat-org/utils';

import { lazy, hydrate } from '../ReactIsomorphic';

import Root from './Root';
import constants from './constants';

const setConfig = /** setConfig */ emptyFunction;
const { routesData, ErrorComponent } = constants;

handleUnhandledRejection();
setConfig({
  errorReporter: ErrorComponent,
});

(async () => {
  const { mainInitialProps, ...store } = window.__CAT_DATA__;
  // preload page
  const {
    component: { loader },
  } =
    routesData.find(
      ({ component: { chunkName } }: $ElementType<typeof routesData, number>) =>
        store.chunkName === chunkName,
    ) ||
    (() => {
      throw new Error('Can not find page component');
    })();
  const { default: Component } = await loader();
  /** @react page Component */
  const Page = <-P>(props: P) => (
    <Component {...props} {...store.initialProps} />
  );

  Root.preload({
    ...store,
    Page: lazy(async () => ({ default: Page }), store.chunkName),
  });

  // render
  await hydrate(
    <Router>
      <Root
        mainInitialProps={{
          ...mainInitialProps,
          Component,
        }}
      />
    </Router>,
    document.getElementById('__CAT__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })(),
  );
})();
