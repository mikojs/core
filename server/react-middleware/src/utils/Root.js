// @flow

import React, { type ComponentType } from 'react';
import { matchRoutes } from 'react-router-config';
import { Route } from 'react-router-dom';
import { type Context as koaContextType } from 'koa';
import { emptyFunction, ExecutionEnvironment } from 'fbjs';

import { type errorPropsType } from '../types';

import { lazy, Suspense, type lazyComponentType } from './ReactIsomorphic';

type propsType = {|
  Main: ComponentType<*>,
  Error: ComponentType<errorPropsType>,
  routesData: $ReadOnlyArray<{|
    exact: true,
    path: $ReadOnlyArray<string>,
    component: {
      loader: lazyComponentType,
      moduleId: string,
    },
  |}>,
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
  initialProps: mixed,
};

const store: storeType = {};

/**
 * TODO: after react.lazy support server side, remove moduleId and use `children={this.getPage}`
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
        component: { loader, moduleId },
      },
    },
  ] = matchRoutes(routesData, ctx.ctx.path);

  return lazy(async (): $Call<lazyComponentType> => {
    const {
      default: Component,
      getInitialProps = emptyFunction.thatReturns({}),
    } = await loader();
    const initialProps =
      store.url === ctx.ctx.url || !ExecutionEnvironment.canUseEventListeners
        ? store.initialProps
        : await getInitialProps(ctx);
    // TODO component should be ignored
    // eslint-disable-next-line require-jsdoc, flowtype/require-return-type
    const Page = () => <Component {...initialProps} />;

    store.url = ctx.ctx.url;
    store.initialProps = initialProps;

    return { default: Page };
  }, moduleId);
};

// TODO component should be ignored
/* eslint-disable require-jsdoc, flowtype/require-return-type */
export default class Root extends React.PureComponent<propsType, stateType> {
  static preload = ({ url, initialProps }: storeType = store): storeType => {
    store.url = url;
    store.initialProps = initialProps;

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
    const { Main, Error, routesData } = this.props;
    const { error, errorInfo } = this.state;

    if (error && errorInfo)
      return <Error error={error} errorInfo={errorInfo} />;

    return (
      <Main>
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
