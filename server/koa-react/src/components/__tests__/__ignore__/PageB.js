// @flow

import React, { type Node as NodeType } from 'react';
import { Link } from 'react-router-dom';

export const pageBRender = jest.fn<$ReadOnlyArray<void>, void>();

/** @react use to test page B rendering */
const PageB = (): NodeType => {
  pageBRender();

  return <Link to="/pageA" />;
};

PageB.getInitialProps = jest.fn<$ReadOnlyArray<void>, void>();

export default PageB;
