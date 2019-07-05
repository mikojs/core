// @flow

import React, { type ComponentType } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { emptyFunction } from 'fbjs';

import { mockChoice, handleUnhandledRejection } from '@cat-org/utils';

import { lazy, hydrate } from '../ReactIsomorphic';

import Root, { type propsType as rootPropsType } from './Root';

import Main from 'templates/Main';
import Loading from 'templates/Loading';
import ErrorComponent from 'templates/Error';

const setConfig = /** setConfig */ emptyFunction;

handleUnhandledRejection();
setConfig({
  errorReporter: ErrorComponent,
});

/**
 * @example
 * render([])
 *
 * @param {Array} routesData - routes data
 *
 * @return {Component} - page component
 */
const render = async (
  routesData: $PropertyType<rootPropsType, 'routesData'>,
): Promise<ComponentType<{||}>> => {
  const { mainInitialProps, ...store } = window.__CAT_DATA__;
  // preload page
  const {
    component: { loader },
  } =
    routesData.find(
      ({
        component: { chunkName },
      }: $ElementType<$PropertyType<rootPropsType, 'routesData'>, number>) =>
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
        Main={Main}
        Loading={Loading}
        Error={ErrorComponent}
        routesData={routesData}
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

  return Page;
};

mockChoice(
  process.env.NODE_ENV === 'test',
  emptyFunction,
  render,
  /** routesData */ [],
);

export default render;
