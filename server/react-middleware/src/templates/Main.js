// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';

type propsType = {|
  children: NodeType,
|};

export default class Main extends React.PureComponent<propsType> {
  render() {
    const { children } = this.props;

    return children;
  }
}
