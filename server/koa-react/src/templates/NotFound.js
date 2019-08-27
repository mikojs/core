// @flow

import React, { type Node as NodeType } from 'react';
import { Helmet } from 'react-helmet';

import { type pageCtxType } from '../types';

import * as styles from './styles/notFound';

/** @react render the not found page */
const NotFound = () => (
  <div style={styles.root}>
    <h1 style={styles.h1}>404</h1>

    <h2 style={styles.h2}>Page not found</h2>
  </div>
);

/**
 * @example
 * NotFound.getInitialProps({ ctx })
 *
 * @param {pageCtxType} context - cnotext data
 *
 * @return {object} - initial props
 */
NotFound.getInitialProps = ({
  ctx,
}: pageCtxType<{| status: number |}>): {|
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

export default React.memo<{||}>(NotFound);
