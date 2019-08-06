// @flow

import React, { useRef, type Node as NodeType } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ExecutionEnvironment } from 'fbjs';

import { type sourceType } from './types';

type propsType = {|
  source: sourceType,
|};

const Renderer = React.memo<propsType>(
  ({
    source: {
      id,
      data: { dndType, type, props = {} },
      children = [],
    },
  }: propsType): NodeType => {
    const newProps = { ...props };

    if (children.length !== 0)
      newProps.children = children.map((child: sourceType) => (
        <Renderer key={child.id} source={child} />
      ));

    if (ExecutionEnvironment.canUseEventListeners) {
      const [{ isDragging }, connectDrag] = useDrag({
        item: { id, type: dndType },
        collect: (monitor: {| isDragging: () => boolean |}) => ({
          isDragging: monitor.isDragging(),
        }),
      });
      const [, connectDrop] = useDrop({
        accept: ['manager', 'previewer', 'component', 'new-component'],
        hover: ({ id: draggedId }: {| id: string |}) => {
          // TODO if (draggedId !== id) handler(draggedId, id);
        },
      });

      newProps.ref = useRef(null);
      newProps.style = !isDragging
        ? newProps.style
        : {
            ...newProps.style,
            opacity: 0,
          };

      connectDrag(newProps.ref);
      connectDrop(newProps.ref);
    }

    return React.createElement(type, newProps);
  },
);

export default Renderer;
