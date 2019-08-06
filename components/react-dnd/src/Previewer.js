// @flow

import React, { type Node as NodeType } from 'react';

import styles from './styles/previewer';

type propsType = {
  children: NodeType,
  forwardedRef:
    | { current: null | HTMLDivElement, ... }
    | ((null | HTMLDivElement) => mixed),
};

/** @react render the Previewer Container */
const Previewer = ({ children, forwardedRef }: propsType) => (
  <div ref={forwardedRef} style={styles}>
    {children}
  </div>
);
const MemoPreviewer = React.memo<propsType>(Previewer);

export default React.forwardRef<
  $Diff<propsType, { forwardedRef: mixed }>,
  HTMLDivElement,
>(
  (
    props: $Diff<propsType, { forwardedRef: mixed }>,
    ref: $PropertyType<propsType, 'forwardedRef'>,
  ) => <MemoPreviewer {...props} forwardedRef={ref} />,
);
