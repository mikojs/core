// @flow

import React, { type Node as NodeType } from 'react';

/** NoGetInitialProps Component */
export default class NoGetInitialProps extends React.PureComponent<*> {
  /** @react */
  render(): NodeType {
    return <div>noGetInitialProps</div>;
  }
}
