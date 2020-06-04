// @flow

import React from 'react';

import { type pageInitialArguType } from '@mikojs/react-ssr';

type propsType = {|
  name?: string,
  pathname: string,
|};

/** @react Home Component */
const Home = ({ name = 'Home', pathname }: propsType) => (
  <div>
    {name}:{pathname}
  </div>
);

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
