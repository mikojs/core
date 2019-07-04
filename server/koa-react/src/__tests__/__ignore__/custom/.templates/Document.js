// @flow

import React, { type Node as NodeType } from 'react';
import { type Helmet as HelmetType } from 'react-helmet';

// TODO: component should be ignored
// eslint-disable-next-line jsdoc/require-jsdoc
export default ({
  helmet,
  children,
}: {|
  helmet: $Call<$PropertyType<Class<HelmetType>, 'renderStatic'>>,
  children: NodeType,
|}) => (
  <>
    {children}
    {helmet.script.toComponent()}
  </>
);
