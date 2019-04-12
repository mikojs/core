// @flow
/* eslint-disable require-jsdoc */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';

export default class NoGetInitialProps extends React.PureComponent<*> {
  render(): NodeType {
    return <div>noGetInitialProps</div>;
  }
}
