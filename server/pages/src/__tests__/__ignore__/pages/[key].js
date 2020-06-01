// @flow

import React from 'react';

import { type pageInitialArguType } from '@mikojs/react-ssr';

type propsType = {|
  querystring: string,
|};

/** @react Key Component */
const Key = ({ querystring }: propsType) => <div>{querystring}</div>;

/**
 * @param {pageInitialArguType} context - context data
 *
 * @return {propsType} - initial props
 */
Key.getInitialProps = ({
  ctx,
}: pageInitialArguType<{| querystring: string |}>) => ({
  querystring: ctx.querystring,
});

export default React.memo<propsType>(Key);
