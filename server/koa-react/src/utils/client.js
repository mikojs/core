// @flow

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { emptyFunction } from 'fbjs';

import { mockChoice, handleUnhandledRejection } from '@cat-org/utils';

import { lazy, hydrate } from '../ReactIsomorphic';

import Root, { type propsType as rootPropsType } from './Root';
import PagesHelper from './PagesHelper';

import Main from 'templates/Main';
import Loading from 'templates/Loading';
import ErrorComponent from 'templates/Error';
import routesData from 'templates/routesData';

export type preloadType = {|
  originalUrl: $PropertyType<PagesHelper, 'originalUrl'>,
  chunkName: $PropertyType<PagesHelper, 'chunkName'>,
  initialProps: $PropertyType<PagesHelper, 'initialProps'>,
  mainInitialProps: $PropertyType<rootPropsType, 'mainInitialProps'>,
|};

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
    originalUrl,
    chunkName,
    initialProps,
    mainInitialProps,
  }: preloadType = window.__CAT_DATA__;
  // preload page
  const {
    component: { loader },
  } =
    routesData.find(
      ({
        component,
      }: $ElementType<$PropertyType<PagesHelper, 'routesData'>, number>) =>
        chunkName === component.chunkName,
    ) ||
    (() => {
      throw new Error('Can not find page component');
    })();
  const { default: Component } = await loader();
  /** @react page Component */
  const Page = <-P>(props: P) => <Component {...props} {...initialProps} />;
  const pagesHelper = new PagesHelper(routesData);

  pagesHelper.originalUrl = originalUrl;
  pagesHelper.Page = lazy(async () => ({ default: Page }), chunkName);

  // render
  await hydrate(
    <Router>
      <Root
        Main={Main}
        Loading={Loading}
        Error={ErrorComponent}
        pagesHelper={pagesHelper}
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
};

mockChoice(process.env.NODE_ENV === 'test', emptyFunction, run);

export default run;
