// @flow

import React, { useState, type Node as NodeType } from 'react';
import { useDragLayer, type monitorType } from 'react-dnd-cjs';
import { emptyFunction } from 'fbjs';

import * as styles from './styles/dragLayer';

type propsType = {|
  children: NodeType,
|};

type contextType = {|
  setAdditionalOffset: ({| x: number, y: number |}) => void,
|};

export const DragLayerContext = React.createContext<contextType>({
  setAdditionalOffset: emptyFunction,
});

/** @react render the custom drag layer */
const DragLayer = ({ children }: propsType): NodeType => {
  const { isDragging, initialOffset, currentOffset } = useDragLayer(
    (monitor: monitorType) => ({
      // TODO: itemType: monitor.getItemType(),
      isDragging: monitor.isDragging(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
    }),
  );
  const [additionalOffset, setAdditionalOffset] = useState({ x: 0, y: 0 });

  return (
    <DragLayerContext.Provider value={{ setAdditionalOffset }}>
      {!isDragging ? null : (
        <div style={styles.root}>
          <div
            style={
              !initialOffset || !currentOffset
                ? styles.hide
                : {
                    transform: `translate(${currentOffset.x +
                      additionalOffset.x}px, ${currentOffset.y +
                      additionalOffset.y}px)`,
                  }
            }
          >
            <button>test</button>
          </div>
        </div>
      )}

      {children}
    </DragLayerContext.Provider>
  );
};

export default React.memo<propsType>(DragLayer);
