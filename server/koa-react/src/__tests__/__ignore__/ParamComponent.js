// @flow

import React from 'react';

import { type pageCtxType } from '../../types';

type propsType = {|
  path: string,
  params: { [string]: string },
|};

/** @react Component */
const Component = ({ path, params }: propsType) => (
  <div>
    {path}-{JSON.stringify(params)}
  </div>
);

/**
 * @example
 * Component.getInitialProps(context)
 *
 * @param {pageCtxType} context - context data
 *
 * @return {propsType} - initial props
 */
Component.getInitialProps = ({ ctx, match: { params } }: pageCtxType<>) => ({
  path: ctx.path,
  params,
});

export default React.memo<propsType>(Component);
