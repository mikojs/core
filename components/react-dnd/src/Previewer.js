// @flow

import React, {
  useRef,
  type ComponentType,
  type Node as NodeType,
} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ExecutionEnvironment } from 'fbjs';

type sourceType = {|
  id: string,
  data: {
    type: string | ComponentType<*>,
    props?: {
      children?: NodeType,
      style?: {},
    },
  },
  children: $ReadOnlyArray<sourceType>,
|};

export type propsType = {|
  source: sourceType,
  handler: (draggedId: string, targetId: string) => void,
|};

/** @react */
const Previewer = React.memo<propsType>(
  ({
    source: {
      id,
      data: { type, props = {} },
      children = [],
    },
    handler,
  }: propsType): NodeType => {
    if (children.length !== 0)
      return React.createElement(type, {
        ...props,
        children: children.map((child: sourceType) => (
          <Previewer key={child.id} source={child} handler={handler} />
        )),
      });

    if (!ExecutionEnvironment.canUseEventListeners)
      return React.createElement(type, props);

    const ref = useRef(null);
    const [{ isDragging }, connectDrag] = useDrag({
      item: { id, type: 'Previewer' },
      collect: (monitor: {| isDragging: () => boolean |}) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    const [, connectDrop] = useDrop({
      accept: 'Previewer',
      hover: ({ id: draggedId }: {| id: string |}) => {
        if (draggedId !== id) handler(draggedId, id);
      },
    });
    connectDrag(ref);
    connectDrop(ref);

    return React.createElement(type, {
      ...props,
      ref,
      style: !isDragging
        ? props.style
        : {
            ...props.style,
            opacity: 0,
          },
    });
  },
);

export default Previewer;
