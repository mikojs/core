// @flow

import { useContext, useEffect } from 'react';
import { DndContext } from 'react-dnd-cjs';
import { FrameContext } from 'react-frame-component';

/**
 * @example
 * useMainProps()
 *
 * @return {object} - the props of the main
 */
export default (): {} => {
  const { dragDropManager } = useContext(DndContext);
  const { window } = useContext(FrameContext);

  useEffect(() => {
    dragDropManager.getBackend().addEventListeners(window);
  }, []);

  return {
    style: {
      width: '100vw',
      height: '100vh',
    },
  };
};
