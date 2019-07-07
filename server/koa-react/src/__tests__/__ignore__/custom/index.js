// @flow

import React, { type Node as NodeType } from 'react';

type propsType = {|
  value: string,
  test: string,
|};

/** Home Component */
export default class Home extends React.PureComponent<propsType> {
  /**
   * @example
   * Home.getInitialProps()
   *
   * @return {propsType} - initial props
   */
  static getInitialProps = () => ({
    test: 'value',
  });

  /** @react */
  render(): NodeType {
    const { value, test } = this.props;

    return (
      <div>
        {value}-{test}
      </div>
    );
  }
}
