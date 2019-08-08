// @flow

import React, { useRef, type Node as NodeType } from 'react';
import { useDrag, useDrop } from 'react-dnd-cjs';
import { ExecutionEnvironment } from 'fbjs';

import { type sourceType, type contextType } from './types';

type propsType = {|
  source: sourceType,
  handler: $PropertyType<contextType, 'handler'>,
|};

/** @react render the Renderer Component for the source data */
const Renderer = React.memo<propsType>(
  ({
    source: {
      id,
      data: { kind, type, props = {} },
      children = [],
    },
    handler,
  }: propsType): NodeType => {
    const newProps = { ...props };

    if (children.length !== 0)
      newProps.children = children.map((child: sourceType) => (
        <Renderer key={child.id} source={child} handler={handler} />
      ));

    if (ExecutionEnvironment.canUseEventListeners) {
      newProps.ref = useRef(null);

      if (['component', 'new-component'].includes(kind)) {
        const [{ isDragging }, connectDrag] = useDrag({
          item: { id, type: kind },
          collect: (monitor: {| isDragging: () => boolean |}) => ({
            isDragging: monitor.isDragging(),
          }),
        });

        connectDrag(newProps.ref);
        newProps.style = !isDragging
          ? newProps.style
          : {
              ...newProps.style,
              opacity: 0,
            };
      }

      const [, connectDrop] = useDrop({
        accept: ['manager', 'previewer', 'component', 'new-component'],
        hover: ({
          id: draggedId,
          type: draggedType,
        }: {|
          id: string,
          type: string,
        |}) => {
          if (draggedId !== id) handler(draggedType, draggedId, id);
        },
      });

      connectDrop(newProps.ref);
    }

    return React.createElement(type, newProps);
  },
);

Renderer.displayName = 'Memo(Renderer)';

export default Renderer;
