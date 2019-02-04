// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React from 'react';

import { type ctxType } from '../../types';

type propsType = {|
  path: string,
|};

export default class Component extends React.PureComponent<propsType> {
  static getInitialProps = ({ ctx }: ctxType<>) => ({
    path: ctx.path,
  });

  render() {
    const { path } = this.props;

    return <div>{path}</div>;
  }
}
