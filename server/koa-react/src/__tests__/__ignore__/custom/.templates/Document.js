// @flow

import React, { type Node as NodeType } from 'react';
import { type Helmet as HelmetType } from 'react-helmet';

/** @react render the html */
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
