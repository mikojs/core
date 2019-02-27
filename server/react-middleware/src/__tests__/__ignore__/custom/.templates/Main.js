// @flow

import React, { type Node as NodeType } from 'react';

import Context from '../../Context';

type propsType = {|
  value: string,
  children: NodeType,
|};

export default class Main extends React.PureComponent<propsType> {
  static getInitialProps = () => ({
    value: 'test data',
  });

  render() {
    const { value, children } = this.props;

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }
}
