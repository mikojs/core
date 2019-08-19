// @flow

import React, { type Node as NodeType } from 'react';

import styles from './styles/manager';

type propsType = {
  children: NodeType,
  forwardedRef:
    | { current: null | HTMLDivElement, ... }
    | ((null | HTMLDivElement) => mixed),
};

/** @react render the Manager Container */
const Manager = ({ children, forwardedRef }: propsType) => (
  <div ref={forwardedRef} style={styles}>
    {children}
  </div>
);
const MemoManager = React.memo<propsType>(Manager);

export default React.forwardRef<
  $Diff<propsType, { forwardedRef: mixed }>,
  HTMLDivElement,
>(
  (
    props: $Diff<propsType, { forwardedRef: mixed }>,
    ref: $PropertyType<propsType, 'forwardedRef'>,
  ) => <MemoManager {...props} forwardedRef={ref} />,
);
