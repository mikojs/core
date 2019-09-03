// @flow

import React, { type Node as NodeType } from 'react';
import { Link } from 'react-router-dom';

export const pageARender = jest.fn<$ReadOnlyArray<void>, void>();

/** @react use to test page A rendering */
const PageA = (): NodeType => {
  pageARender();

  return <Link to="/pageB" />;
};

PageA.getInitialProps = jest.fn<$ReadOnlyArray<void>, void>();

export default PageA;
