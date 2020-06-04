// @flow

import React, { type Node as NodeType } from 'react';

import { type mainInitialArguType } from '@mikojs/react-ssr';

type propsType = {|
  name: string,
  children: ({ name: string }) => NodeType,
|};

/** @react Main Component */
const Main = ({ name, children }: propsType) => children({ name });

/**
 * @param {mainInitialArguType} context - context data
 *
 * @return {propsType} - initial props
 */
Main.getInitialProps = ({ Page }: mainInitialArguType<>) => ({
  name: Page.name,
});

export default React.memo<propsType>(Main);
