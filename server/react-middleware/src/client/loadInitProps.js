// @flow

import React, { type ComponentType, type Node as NodeType } from 'react';
import { emptyFunction } from 'fbjs';

import { mockChoice } from '@cat-org/utils';

type propsType = {
  getInitialProps: ({}) => Promise<{}>,
  children: ({}) => NodeType,
};

type stateType = {
  initialProps: ?{},
};

let initialized: boolean = false;

/* eslint-disable require-jsdoc, flowtype/require-return-type, flowtype/require-parameter-type */
// TODO component should be ignored
class LoadInitialProps extends React.PureComponent<propsType, stateType> {
  state = {
    initialProps: !initialized ? window.__CAT_DATA__ : null,
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
  default: ComponentType<*>,
  getInitialProps: ({}) => Promise<{}>,
}) => (
  <LoadInitialProps getInitialProps={getInitialProps}>
    {(initialProps: {}) => <Component {...initialProps} />}
  </LoadInitialProps>
);
