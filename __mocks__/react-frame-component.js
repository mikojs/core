// @flow

import React, { type Node as NodeType } from 'react';

export const FrameContext = React.createContext<{|
  window: {},
|}>({
  window: global.window,
});

/** @react mock react-framge-component */
export default ({ children }: {| children: NodeType |}) => children;
