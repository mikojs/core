// @flow

import React, { type ElementType, type Node as NodeType } from 'react';
import { emptyFunction } from 'fbjs';

import { mockChoice } from '@cat-org/utils';

type ctxType = {|
  isServer: false,
  ctx: {},
|};

type propsType = {|
  getInitialProps?: ctxType => Promise<{}>,
  children: ({}) => NodeType,
|};

type stateType = {|
  initialProps: ?{},
|};

let initialized: boolean = false;

/* eslint-disable require-jsdoc, flowtype/require-return-type, flowtype/require-parameter-type */
// TODO component should be ignored
class LoadInitialProps extends React.PureComponent<propsType, stateType> {
  state = {
    initialProps: !initialized ? window.__CAT_DATA__ : null,
  };

  componentDidMount() {
    if (!initialized) {
      initialized = true;
      return;
    }

    setTimeout(
      this.load,
      // Delay update time for dev mode
      mockChoice(
        process.env.NODE_ENV === 'production',
        emptyFunction.thatReturns(0),
        emptyFunction.thatReturns(100),
      ),
    );
  }

  load = async () => {
    const { getInitialProps } = this.props;

    this.setState({
      initialProps:
        (await getInitialProps?.({ ctx: {}, isServer: false })) || {},
    });
  };

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
  default: ElementType,
  getInitialProps?: $ElementType<propsType, 'getInitialProps'>,
}) => (
  <LoadInitialProps getInitialProps={getInitialProps}>
    {(initialProps: mixed) => <Component {...initialProps} />}
  </LoadInitialProps>
);
