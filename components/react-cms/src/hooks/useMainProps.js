// @flow

import { useContext, useEffect } from 'react';
import { DndContext } from 'react-dnd-cjs';
import { FrameContext } from 'react-frame-component';

/**
 * @return {object} - the props of the main
 */
const useMainProps = (): {} => {
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

export default useMainProps;
