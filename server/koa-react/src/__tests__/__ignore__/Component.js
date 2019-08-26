// @flow

import React from 'react';

import { type pageCtxType } from '../../types';

type propsType = {|
  path: string,
|};

/** @react Component */
const Component = ({ path }: propsType) => <div>{path}</div>;

/**
 * @example
 * Component.getInitialProps(context)
 *
 * @param {pageCtxType} context - context data
 *
 * @return {propsType} - initial props
 */
Component.getInitialProps = ({ ctx }: pageCtxType<>) => ({
  path: ctx.path,
});

export default React.memo<propsType>(Component);
