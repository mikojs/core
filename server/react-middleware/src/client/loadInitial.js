// @flow

import React, { type ElementType, type Node as NodeType } from 'react';
import { withRouter } from 'react-router';
import { emptyFunction } from 'fbjs';

import { mockChoice } from '@cat-org/utils';

import { type ctxType } from '../types';

import ErrorComponent from 'templates/Error';
import Loading from 'templates/Loading';

type stateType = {|
  initialProps: ?{
    head?: NodeType,
  },
|};

type propsType = {|
  getInitialProps?: (
    ctxType<>,
  ) => Promise<$NonMaybeType<$PropertyType<stateType, 'initialProps'>>>,
  children: (
    initialProps: $NonMaybeType<$PropertyType<stateType, 'initialProps'>>,
  ) => NodeType,
|};

let initialized: boolean = false;

/* eslint-disable require-jsdoc, flowtype/require-return-type, flowtype/require-parameter-type */
// TODO component should be ignored
@withRouter
class LoadInitialProps extends React.PureComponent<propsType, stateType> {
  state = {
    initialProps: !initialized ? window.__CAT_DATA__ : null,
  };

  componentDidMount() {
    initialized = true;
    setTimeout(
      this.load,
      // Delay update time for dev mode
      mockChoice(
        process.env.NODE_ENV === 'production',
        emptyFunction.thatReturns(0),
        emptyFunction.thatReturns(100),
      ),
    );
  }

  load = async () => {
    const {
      // $FlowFixMe remove after flow support decorators
      location: { pathname, search },
      getInitialProps,
    } = this.props;

    this.setState({
      initialProps:
        (await getInitialProps?.({
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
        })) || {},
    });
  };

  render() {
    const { children } = this.props;
    const { initialProps } = this.state;

    if (!initialProps) return <Loading />;

    return children(initialProps);
  }
}
/* eslint-enable require-jsdoc, flowtype/require-return-type, flowtype/require-parameter-type */

/**
 * @example
 * loading({})
 *
 * @param {Object} argument - react-loadable loading
 *
 * @return {Component} - Loading Component
 */
export const loading = ({ error }: { error: ?Error }) =>
  error ? (
    <ErrorComponent error={error} errorInfo={{ componentStack: '' }} />
  ) : (
    <Loading />
  );

/**
 * @example
 * render({ default: <div /> })
 *
 * @param {Object} argument - react-loadable render
 *
 * @return {Component} - LoadInitialProps Component
 */
export const render = ({
  default: Component,
  getInitialProps,
}: {
  default: ElementType,
  getInitialProps?: $PropertyType<propsType, 'getInitialProps'>,
}) => (
  <LoadInitialProps getInitialProps={getInitialProps}>
    {({
      head,
      ...initialProps
    }: $NonMaybeType<$PropertyType<stateType, 'initialProps'>>) => (
      <>
        {head}
        <Component {...initialProps} />
      </>
    )}
  </LoadInitialProps>
);
