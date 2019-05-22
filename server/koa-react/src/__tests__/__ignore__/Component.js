// @flow
/* eslint-disable require-jsdoc */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';

import { type ctxType } from '../../types';

type propsType = {|
  path: string,
|};

export default class Component extends React.PureComponent<propsType> {
  static getInitialProps = ({ ctx }: ctxType<>) => ({
    path: ctx.path,
  });

  render(): NodeType {
    const { path } = this.props;

    return <div>{path}</div>;
  }
}
