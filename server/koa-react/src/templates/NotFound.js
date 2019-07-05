// @flow

import React, { type Node as NodeType } from 'react';
import { Helmet } from 'react-helmet';

import { type ctxType } from '../types';

import * as styles from './styles/notFound';

/** NotFound Component to render the not found page */
export default class NotFound extends React.PureComponent<*> {
  /**
   * @example
   * NotFound.getInitialProps({ ctx })
   *
   * @param {context} context - cnotext data
   *
   * @return {initialProps} - initial props
   */
  static getInitialProps = ({
    ctx,
  }: ctxType<{| status: number |}>): {|
    head: NodeType,
  |} => {
    ctx.status = 404;

    return {
      head: (
        <Helmet>
          <title>404 | Page not found</title>
        </Helmet>
      ),
    };
  };

  /** @react */
  render(): NodeType {
    return (
      <div style={styles.root}>
        <h1 style={styles.h1}>404</h1>

        <h2 style={styles.h2}>Page not found</h2>
      </div>
    );
  }
}
