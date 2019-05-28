// @flow
/* eslint-disable require-jsdoc */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';

import Context from '../Context';

type propsType = {|
  test: string,
|};

export default class Home extends React.PureComponent<propsType> {
  static getInitialProps = () => ({
    test: 'value',
  });

  render(): NodeType {
    const { test } = this.props;

    return (
      <Context.Consumer>
        {(data: string) => (
          <div>
            {data}-{test}
          </div>
        )}
      </Context.Consumer>
    );
  }
}
