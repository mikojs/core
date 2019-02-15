// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { setConfig } from 'react-hot-loader';

import { handleUnhandledRejection } from '@cat-org/utils';

import Root, { type routeDataType } from './Root';

import Main from 'templates/Main';
import ErrorComponent from 'templates/Error';

handleUnhandledRejection();
setConfig({
  errorReporter: ErrorComponent,
});

(async () => {
  /** #__PURE__ */ const routesData = [];

  // preload page
  const {
    component: { loader },
  } =
    routesData.find(
      ({ component: { chunkName } }: routeDataType) =>
        chunkName === window.__CAT_DATA__.chunkName,
    ) ||
    (() => {
      throw new Error('Can not find page component');
    })();
  const { default: Component } = await loader();
  // TODO component should be ignored
  // eslint-disable-next-line require-jsdoc, flowtype/require-return-type
  const Page = () => <Component {...window.__CAT_DATA__.initialProps} />;

  window.__CAT_DATA__.Page = Page;
  Root.preload(window.__CAT_DATA__);

  // render
  ReactDOM.hydrate(
    <Router>
      <Root Main={Main} Error={ErrorComponent} routesData={routesData} />
    </Router>,
    document.getElementById('__cat__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })(),
  );
})();
