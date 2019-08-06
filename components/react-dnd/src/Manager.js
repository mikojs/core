// @flow

import React, { type Node as NodeType } from 'react';

type propsType = {
  children: NodeType,
  forwardedRef:
    | { current: null | HTMLDivElement, ... }
    | ((null | HTMLDivElement) => mixed),
};

const Manager = React.memo<propsType>(
  ({ children, forwardedRef }: propsType) => (
    <div ref={forwardedRef}>{children}</div>
  ),
);

export default React.forwardRef<
  $Diff<propsType, { forwardedRef: mixed }>,
  HTMLDivElement,
>(
  (
    props: $Diff<propsType, { forwardedRef: mixed }>,
    ref: $PropertyType<propsType, 'forwardedRef'>,
  ) => <Manager {...props} forwardedRef={ref} />,
);
