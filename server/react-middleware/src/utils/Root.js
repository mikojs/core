// @flow

import React, { type ComponentType, type Node as NodeType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { matchRoutes } from 'react-router-config';
import { Route } from 'react-router-dom';
import { type Context as koaContextType } from 'koa';
import { ExecutionEnvironment } from 'fbjs';

import { type errorPropsType } from '../types';

import { lazy, Suspense, type lazyComponentType } from './ReactIsomorphic';

export type routeDataType = {|
  exact: true,
  path: $ReadOnlyArray<string>,
  component: {|
    loader: lazyComponentType,
    chunkName: string,
  |},
|};

type propsType = {|
  Main: ComponentType<*>,
  Error: ComponentType<errorPropsType>,
  routesData: $ReadOnlyArray<routeDataType>,
  mainInitialProps: {},
|};

type stateType = {|
  error: ?$PropertyType<errorPropsType, 'error'>,
  errorInfo: ?$PropertyType<errorPropsType, 'errorInfo'>,
|};

// TODO: should use flow-typed
type contextRouterType = {|
  location: {
    pathname: string,
    search: string,
  },
  staticContext: ?koaContextType,
|};

type storeType = {
  url: string,
  chunkName: string,
  initialProps: {
    head: ?NodeType,
  },
  Page: () => ComponentType<void>,
};

const store: storeType = {};

/**
 * TODO: after react.lazy support server side, remove chunkName and use `children={this.getPage}`
 *
 * @example
 * getPage(routsData, ctx)
 *
 * @param {Array} routesData - routes data
 * @param {Object} Context - getInitialProps context
 *
 * @return {Component} - page component
 */
const getPage = (
  routesData: $PropertyType<propsType, 'routesData'>,
  { location: { pathname, search }, staticContext }: contextRouterType,
): ComponentType<*> => {
  const ctx = {
    ctx: staticContext || {
      path: pathname,
      querystring: search.replace(/\?/, ''),
      url: `${pathname}${search}`,
      originalUrl: `${pathname}${search}`,
      origin: window.location.origin,
      href: window.location.href,
      host: window.location.host,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
    },
    isServer: !ExecutionEnvironment.canUseEventListeners,
  };

  const [
    {
      route: {
        component: { loader, chunkName },
      },
    },
  ] = matchRoutes(routesData, ctx.ctx.path);

  if (!ctx.isServer && store.url === ctx.ctx.url) return store.Page;

  return lazy(async (): $Call<lazyComponentType> => {
    const { default: Component } = await loader();
    const { head, ...initialProps } =
      // $FlowFixMe Flow does not yet support method or property calls in optional chains.
      (await Component.getInitialProps?.(ctx)) || {};
    // TODO component should be ignored
    // eslint-disable-next-line require-jsdoc, flowtype/require-return-type
    const Page = () => <Component {...initialProps} />;

    renderToStaticMarkup(head || null);
    store.url = ctx.ctx.url;
    store.chunkName = chunkName;
    store.initialProps = {
      ...initialProps,
      head: ctx.isServer ? null : head,
    };
    store.Page = Page;

    return { default: Page };
  }, chunkName);
};

// TODO component should be ignored
/* eslint-disable require-jsdoc, flowtype/require-return-type */
export default class Root extends React.PureComponent<propsType, stateType> {
  static preload = (prevStore: storeType = store): storeType => {
    Object.keys(prevStore).forEach((key: string) => {
      store[key] = prevStore[key];
    });

    return store;
  };

  static getPage = getPage;

  state = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch(
    error: $PropertyType<stateType, 'error'>,
    errorInfo: $PropertyType<stateType, 'errorInfo'>,
  ) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { Main, Error, routesData, mainInitialProps } = this.props;
    const { error, errorInfo } = this.state;

    if (error && errorInfo)
      return <Error error={error} errorInfo={errorInfo} />;

    return (
      <Main {...mainInitialProps}>
        <Suspense fallback={<div>TODO Loading...</div>}>
          <Route
            children={(context: contextRouterType) =>
              React.createElement(getPage(routesData, context))
            }
          />
        </Suspense>
      </Main>
    );
  }
}
/* eslint-enable require-jsdoc, flowtype/require-return-type */
