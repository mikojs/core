// @flow
/* eslint-disable require-jsdoc */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';

import { type mainCtxType } from '../../../../types';

type propsType = {|
  value: string,
  name: string,
  pageProps: {},
  children: ({ value: string }) => NodeType,
|};

export default class Main extends React.PureComponent<propsType> {
  static getInitialProps = ({ Component, pageProps }: mainCtxType<{}>) => ({
    value: 'test data',
    name: Component.name,
    pageProps,
  });

  render(): NodeType {
    const { value, name, pageProps, children } = this.props;

    return (
      <div>
        {name}
        {JSON.stringify(pageProps)}
        {children({ value })}
      </div>
    );
  }
}
