// @flow

import React, { type Node as NodeType } from 'react';

import styles from './styles/previewer';

type propsType = {|
  children: NodeType,
|};

/** @react render the Previewer Container */
const Previewer = ({ children }: propsType) => (
  <main style={styles}>{children}</main>
);

export default React.memo<propsType>(Previewer);
