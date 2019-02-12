// @flow

import React, { Suspense, lazy } from 'react';
import { matchRoutes } from 'react-router-config';
import { Route } from 'react-router-dom';
import { emptyFunction } from 'fbjs';

type propsType = {|
  Main: ElementType,
  Error: ElementType,
  routesData: $ReadOnlyArray<{|
    exact: true,
    path: $ReadOnlyArray<string>,
    component: ElementType,
  |}>,
|};

type stateType = {|
  error: ?$PropertyType<errorPropsType, 'error'>,
  errorInfo: ?$PropertyType<errorPropsType, 'errorInfo'>,
|};

export default class Core extends React.PureComponent<propsType, stateType> {
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

  getPage = ({ location: { pathname, search } }) => {
    const { routesData } = this.props;
    const [
      {
        route: { component }
      },
    ] = matchRoutes(routesData, pathname);
    const Page = lazy(async () => {
      const { default: Component, getInitialProps = emptyFunction.thatReturns({}) } = await component();
      const initialProps = await getInitialProps({
        ctx: {
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
        isServer: false,
      });
      const LoadPage = () => (
        <Component {...initialProps} />
      );

      return {
        default: LoadPage,
      };
    });

    return <Page />
  };

  render() {
    const { Main, Error } = this.props;
    const { error, errorInfo } = this.state;

    if (error && errorInfo)
      return <Error error={error} errorInfo={errorInfo} />;

    return (
      <Main>
        <Suspense fallback={<div>TODO: add default loading...</div>}>
          <Route children={this.getPage} />
        </Suspense>
      </Main>
    );
  }
}
