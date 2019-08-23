// @flow

import React, {
  useContext,
  useEffect,
  useMemo,
  type Node as NodeType,
} from 'react';
import { DndContext } from 'react-dnd-cjs';
import { FrameContext } from 'react-frame-component';
import { getElementPosition } from 'fbjs';

import { DragLayerContext } from './DragLayer';
import styles from './styles/previewer';

type propsType = {
  children: NodeType,
  forwardedRef:
    | { current: null | HTMLElement, ... }
    | ((null | HTMLElement) => mixed),
  isOver: boolean,
};

/** @react render the Previewer Container */
const Previewer = ({ children, forwardedRef, isOver }: propsType): NodeType => {
  const { dragDropManager } = useContext(DndContext);
  const { window } = useContext(FrameContext);
  const { setAdditionalOffset } = useContext(DragLayerContext);

  useMemo(() => {
    const { x, y } = getElementPosition(window.frameElement);

    if (isOver) setAdditionalOffset({ x, y });
    else setAdditionalOffset({ x: 0, y: 0 });
  }, [isOver]);
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
