// @flow

import React, { type Node as NodeType, type ComponentType } from 'react';

export type errorPropsType = {|
  error: Error,
  errorInfo: {
    componentStack: string,
  },
|};

export type propsType = {|
  Error: ComponentType<errorPropsType>,
  children: NodeType,
|};

type stateType = $ObjMap<errorPropsType, <V>(V) => ?V>;

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
