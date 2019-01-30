// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React from 'react';

import { type ctxType } from '../../types';

type propsType = {|
  url: string,
|};

export default class Component extends React.PureComponent<propsType> {
  static getInitialProps = ({
    ctx,
  }: ctxType<{
    url?: string,
  }>) => ({
    url:
      ctx?.url ||
      (() => {
        throw new Error('not test client side');
      })(),
  });

  render() {
    const { url } = this.props;

    return <div>{url}</div>;
  }
}
