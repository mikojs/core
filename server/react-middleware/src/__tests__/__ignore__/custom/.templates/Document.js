// @flow

import React, { type Node as NodeType } from 'react';

import { type helmetType } from '../../../../types';

export default ({
  helmet,
  children,
}: {
  helmet: helmetType,
  children: NodeType,
}) => (
  <>
    {children}
    {helmet.script.toComponent()}
  </>
);
