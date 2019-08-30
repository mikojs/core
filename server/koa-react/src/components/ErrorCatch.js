// @flow

import React, { type Node as NodeType } from 'react';

import { type errorPropsType } from '../types';

import { type propsType as rootPropsType } from './Root';

type propsType = {|
  Error: $PropertyType<rootPropsType, 'Error'>,
  children: NodeType,
|};

type stateType = {|
  error: ?$PropertyType<errorPropsType, 'error'>,
  errorInfo: ?$PropertyType<errorPropsType, 'errorInfo'>,
|};

/** use to catch component rendering error */
export default class ErrorCatch extends React.PureComponent<
  propsType,
  stateType,
> {
  state = {
    error: null,
    errorInfo: null,
  };

  /** @react */
  componentDidCatch(
    error: $PropertyType<stateType, 'error'>,
    errorInfo: $PropertyType<stateType, 'errorInfo'>,
  ) {
    this.setState({ error, errorInfo });
  }

  /** @react */
  render(): NodeType {
    const { Error, children } = this.props;
    const { error, errorInfo } = this.state;

    if (!error || !errorInfo) return children;

    return <Error error={error} errorInfo={errorInfo} />;
  }
}
