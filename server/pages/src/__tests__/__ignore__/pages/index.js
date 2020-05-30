// @flow

import React from 'react';

import { type pageInitialArguType } from '@mikojs/react-ssr';

type propsType = {|
  url: string,
  path: string,
|};

/** @react Home Component */
const Home = ({ url, path }: propsType) => (
  <div>
    {url},{path}
  </div>
);

/**
 * @param {pageInitialArguType} context - context data
 *
 * @return {propsType} - initial props
 */
Home.getInitialProps = ({
  ctx,
}: pageInitialArguType<{| url: string, path: string |}>) => ({
  url: ctx.url,
  path: ctx.path,
});

export default React.memo<propsType>(Home);
