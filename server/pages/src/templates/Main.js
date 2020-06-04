// @flow

import React, { type Node as NodeType } from 'react';

type propsType = {|
  children: () => NodeType,
|};

/** @react control the all page Components */
const Main = ({ children }: propsType) => children();

export default React.memo<propsType>(Main);
