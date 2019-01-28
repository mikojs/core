// @flow

import React, { type Node as NodeType } from 'react';
import { areEqual, emptyFunction } from 'fbjs';

import { mockChoice } from '@cat-org/utils';

let initialized: boolean = false;

/* eslint-disable require-jsdoc, flowtype/require-return-type, flowtype/require-parameter-type */
// TODO component should be ignored
class LoadInitialProps extends React.Component<{
  getInitialProps: Promise<{}>,
}> {
  state = {
    initialProps: !initialized ? __CAT_DATA__ : null,
  };

  componentDidMount() {
    const { getInitialProps } = this.props;

    if (!initialized) {
      initialized = true;
      return;
    }

    setTimeout(async () => {
      this.setState({
        initialProps: (await getInitialProps?.({})) || {},
      });
    }, mockChoice(process.env.NODE_ENV === 'production', emptyFunction.thatReturns(0), emptyFunction.thatReturns(1000)));
  }

  // TODO: testing routeDatas redirect will work, /test/1 -> test/2
  shouldComponentUpdate(nextProps, nextState) {
    const { initialProps } = this.state;

    return !areEqual(initialProps, nextState.initialProps);
  }

  render() {
    const { children } = this.props;
    const { initialProps } = this.state;

    // TODO: add default loading
    if (!initialProps) return 'loading';

    return children(initialProps);
  }
}
/* eslint-enable require-jsdoc, flowtype/require-return-type, flowtype/require-parameter-type */

export default ({
  default: Component,
  getInitialProps,
}: {
  default: NodeType,
  getInitialProps: Promise<{}>,
}) => (
  <LoadInitialProps getInitialProps={getInitialProps}>
    {(initialProps: {}) => <Component {...initialProps} />}
  </LoadInitialProps>
);
