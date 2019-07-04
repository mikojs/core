// @flow

import React, { type Node as NodeType } from 'react';

import { type mainCtxType } from '../../../../types';

type propsType = {|
  value: string,
  name: string,
  pageProps: {},
  children: ({ value: string }) => NodeType,
|};

/** Main Component */
export default class Main extends React.PureComponent<propsType> {
  /**
   * @example
   * Main.getInitialProps(context)
   *
   * @param {context} context - context data
   *
   * @return {initialProps} - initial props
   */
  static getInitialProps = ({ Component, pageProps }: mainCtxType<{}>) => ({
    value: 'test data',
    name: Component.name,
    pageProps,
  });

  // TODO component should be ignored
  // eslint-disable-next-line jsdoc/require-jsdoc
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
