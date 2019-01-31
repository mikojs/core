// @flow

import React, { type Node as NodeType } from 'react';

import Context from '../../Context';

export default ({ children }: { children: NodeType }) => (
  <Context.Provider value="test data">{children}</Context.Provider>
);
