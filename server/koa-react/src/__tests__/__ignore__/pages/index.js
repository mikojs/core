// @flow

import React from 'react';

import { type pageInitialArguType } from '@mikojs/react-ssr';

type propsType = {|
  path: string,
|};

/** @react Home Component */
const Home = ({ path }: propsType) => <div>{path}</div>;

/**
 * @example
 * Home.getInitialProps(context)
 *
 * @param {pageInitialArguType} context - context data
 *
 * @return {propsType} - initial props
 */
Home.getInitialProps = ({ ctx }: pageInitialArguType<{| path: string |}>) => ({
  path: ctx.path,
});

export default React.memo<propsType>(Home);
