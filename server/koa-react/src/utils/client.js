// @flow

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { emptyFunction } from 'fbjs';

import { handleUnhandledRejection } from '@cat-org/utils';

import { lazy, hydrate } from '../ReactIsomorphic';

import Root from './Root';
import Cache from './Cache';

const setConfig = /** setConfig */ emptyFunction;
const cache = new Cache();

handleUnhandledRejection();
setConfig({
  errorReporter: cache.ErrorComponent,
});

(async () => {
  const { mainInitialProps, ...store } = window.__CAT_DATA__;
  // preload page
  const {
    component: { loader },
  } =
    cache.routesData.find(
      ({ component: { chunkName } }: $ElementType<$PropertyType<Cache, 'routesData'>, number>) =>
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
        cache={cache}
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
