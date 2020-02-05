// @flow

import React, { type Node as NodeType } from 'react';

import { type mainInitialArguType } from '@mikojs/react-ssr';

type propsType = {|
  value: string,
  name: ?string,
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
 * @param {mainInitialArguType} context - context data
 *
 * @return {propsType} - initial props
 */
Main.getInitialProps = ({ Page, pageProps }: mainInitialArguType<{}>) => ({
  value: 'test data',
  name: Page.name,
  pageProps,
});

export default React.memo<propsType>(Main);
