// @flow

import React from 'react';

import { type pageInitialArguType } from '@mikojs/react-ssr';

type propsType = {|
  pathname: string,
|};

/** @react Home Component */
const Home = ({ pathname }: propsType) => <div>{pathname}</div>;

/**
 * @param {pageInitialArguType} context - context data
 *
 * @return {propsType} - initial props
 */
Home.getInitialProps = ({
  ctx,
}: pageInitialArguType<{| pathname: string |}>) => ({
  pathname: ctx.pathname,
});

export default React.memo<propsType>(Home);
