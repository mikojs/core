// @flow
/* eslint-disable require-jsdoc */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';

type propsType = {|
  value: string,
  test: string,
|};

export default class Home extends React.PureComponent<propsType> {
  static getInitialProps = () => ({
    test: 'value',
  });

  render(): NodeType {
    const { value, test } = this.props;

    return (
      <div>
        {value}-{test}
      </div>
    );
  }
}
