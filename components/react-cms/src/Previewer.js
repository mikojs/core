// @flow

import React, { useContext, useEffect, type Node as NodeType } from 'react';
import { DndContext } from 'react-dnd-cjs';
import { FrameContext } from 'react-frame-component';

import useDnd from './hooks/useDnd';
import styles from './styles/previewer';

type propsType = {|
  children?: NodeType,
|};

/** @react render the Previewer Container */
const Previewer = ({ children }: propsType): NodeType => {
  const { dragDropManager } = useContext(DndContext);
  const { window } = useContext(FrameContext);

  useEffect(() => {
    dragDropManager.getBackend().addEventListeners(window);
  }, []);

  return <main {...useDnd('previewer', { style: styles })}>{children}</main>;
};

export default React.memo<propsType>(Previewer);
