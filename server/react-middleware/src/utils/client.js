// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { setConfig } from 'react-hot-loader';

import { handleUnhandledRejection } from '@cat-org/utils';

import Root, { type propsType as rootPropsType } from './Root';

import Main from 'templates/Main';
import Loading from 'templates/Loading';
import ErrorComponent from 'templates/Error';

handleUnhandledRejection();
setConfig({
  errorReporter: ErrorComponent,
});

(async () => {
  /** #__PURE__ */ const routesData = [];
  const {
    mainInitialProps,
    chunkName,
    initialProps,
    ...data
  } = window.__CAT_DATA__;

  // preload page
  const {
    component: { loader },
  } =
    routesData.find(
      ({
        component,
      }: $ElementType<$PropertyType<rootPropsType, 'routesData'>, number>) =>
        chunkName === component.chunkName,
    ) ||
    (() => {
      throw new Error('Can not find page component');
    })();
  const { default: Component } = await loader();
  // TODO component should be ignored
  // eslint-disable-next-line require-jsdoc, flowtype/require-return-type
  const Page = () => <Component {...initialProps} />;

  Root.preload({
    ...data,
    Page,
    chunkName,
    initialProps,
  });

  // render
  ReactDOM.hydrate(
    <Router>
      <Root
        Main={Main}
        Loading={Loading}
        Error={ErrorComponent}
        routesData={routesData}
        mainInitialProps={mainInitialProps}
      />
    </Router>,
    document.getElementById('__CAT__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })(),
  );
})();
