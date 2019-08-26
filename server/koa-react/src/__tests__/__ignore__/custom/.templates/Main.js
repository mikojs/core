// @flow

import React, { type Node as NodeType } from 'react';

import { type mainCtxType } from '../../../../types';

type propsType = {|
  value: string,
  name: string,
  pageProps: {},
  children: ({ value: string }) => NodeType,
|};

/** @react Main Component */
const Main = ({ value, name, pageProps, children }: propsType) => (
  <div>
    {name}
    {JSON.stringify(pageProps)}
    {children({ value })}
  </div>
);

/**
 * @example
 * Main.getInitialProps(context)
 *
 * @param {mainCtxType} context - context data
 *
 * @return {propsType} - initial props
 */
Main.getInitialProps = ({ Component, pageProps }: mainCtxType<{}>) => ({
  value: 'test data',
  name: Component.name,
  pageProps,
});

export default React.memo<propsType>(Main);
