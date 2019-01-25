// @flow

import React, { type Node as NodeType } from 'react';

export default ({
  children,
  scripts,
}: {
  children: NodeType,
  scripts: NodeType,
}) => (
  <>
    {children}
    {scripts}
  </>
);
