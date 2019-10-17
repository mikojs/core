// @flow

import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { emptyFunction } from 'fbjs';

import { mockChoice, handleUnhandledRejection } from '@mikojs/utils';

import Root, { type propsType as rootPropsType } from 'components/Root';

import Main from 'templates/Main';
import Loading from 'templates/Loading';
import ErrorComponent from 'templates/Error';
import routesData from 'templates/routesData';

const setConfig = /** setConfig */ emptyFunction;

handleUnhandledRejection();
setConfig({
  errorReporter: ErrorComponent,
});

/**
 * @example
 * run()
 */
const run = async () => {
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
      }: $ElementType<$PropertyType<rootPropsType<>, 'routesData'>, number>) =>
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
        InitialPage={InitialPage}
        mainInitialProps={mainInitialProps}
        pageInitialProps={pageInitialProps}
      />
    </Router>,
    document.getElementById('__MIKOJS__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })(),
  );
};

mockChoice(process.env.NODE_ENV === 'test', emptyFunction, run);

export default run;
