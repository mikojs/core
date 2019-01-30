// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React from 'react';

export default class NoGetInitialProps extends React.PureComponent<*> {
  render() {
    return <div>noGetInitialProps</div>;
  }
}
