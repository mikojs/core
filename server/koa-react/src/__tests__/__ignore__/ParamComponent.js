// @flow

import React, { type Node as NodeType } from 'react';

import { type pageCtxType } from '../../types';

type propsType = {|
  path: string,
  params: { [string]: string },
|};

/** Component */
export default class Component extends React.PureComponent<propsType> {
  /**
   * @example
   * Component.getInitialProps(context)
   *
   * @param {pageCtxType} context - context data
   *
   * @return {propsType} - initial props
   */
  static getInitialProps = ({ ctx, match: { params } }: pageCtxType<>) => ({
    path: ctx.path,
    params,
  });

  /** @react */
  render(): NodeType {
    const { path, params } = this.props;

    return (
      <div>
        {path}-{JSON.stringify(params)}
      </div>
    );
  }
}
