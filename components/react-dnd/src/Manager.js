// @flow

import React, { type Node as NodeType } from 'react';

type propsType = {
  children: NodeType,
};

const Manager = React.memo<propsType>(({ children }: propsType) => (
  <div>{children}</div>
));

export default Manager;
