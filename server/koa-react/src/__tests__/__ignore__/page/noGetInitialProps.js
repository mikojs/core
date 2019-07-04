// @flow

import React, { type Node as NodeType } from 'react';

/** NoGetInitialProps Component */
export default class NoGetInitialProps extends React.PureComponent<*> {
  // TODO component should be ignored
  // eslint-disable-next-line jsdoc/require-jsdoc
  render(): NodeType {
    return <div>noGetInitialProps</div>;
  }
}
