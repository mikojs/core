// @flow

import React, { useContext, useEffect, type Node as NodeType } from 'react';
import { DndContext } from 'react-dnd-cjs';
import { FrameContext } from 'react-frame-component';

import styles from './styles/previewer';

type propsType = {
  children: NodeType,
  forwardedRef:
    | { current: null | HTMLElement, ... }
    | ((null | HTMLElement) => mixed),
};

/** @react render the Previewer Container */
const Previewer = ({ children, forwardedRef }: propsType): NodeType => {
  const { dragDropManager } = useContext(DndContext);
  const { window } = useContext(FrameContext);

  useEffect(() => {
    dragDropManager.getBackend().addEventListeners(window);
  });

  return (
    <main ref={forwardedRef} style={styles}>
      {children}
    </main>
  );
};

const MemoPreviewer = React.memo<propsType>(Previewer);

export default React.forwardRef<
  $Diff<propsType, { forwardedRef: mixed }>,
  HTMLElement,
>(
  (
    props: $Diff<propsType, { forwardedRef: mixed }>,
    ref: $PropertyType<propsType, 'forwardedRef'>,
  ) => <MemoPreviewer {...props} forwardedRef={ref} />,
);
