// @flow

import React, { useRef, type Node as NodeType } from 'react';
import { useDrag, useDrop } from 'react-dnd-cjs';
import { ExecutionEnvironment } from 'fbjs';

import { type dndItemType, type sourceType, type contextType } from './types';

type propsType = {|
  source: sourceType,
  hover: $PropertyType<contextType, 'hover'>,
  drop: $PropertyType<contextType, 'drop'>,
|};

/** @react render the Renderer Component for the source data */
const Renderer = React.memo<propsType>(
  ({
    source: {
      id,
      data: { kind, type, props = {} },
      children = [],
    },
    hover,
    drop,
  }: propsType): NodeType => {
    const newProps = { ...props };
    const item = { id, type: kind };

    if (children.length !== 0)
      newProps.children = children.map((child: sourceType) => (
        <Renderer key={child.id} source={child} hover={hover} drop={drop} />
      ));

    if (ExecutionEnvironment.canUseEventListeners) {
      newProps.ref = useRef(null);

      if (['component', 'new-component'].includes(kind)) {
        const [{ isDragging }, connectDrag] = useDrag({
          item,
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
        hover: (current: dndItemType) => {
          if (current.id !== item.id) hover(current, item);
        },
        drop: (current: dndItemType) => {
          if (current.id !== item.id) drop(current, item);
        },
      });

      connectDrop(newProps.ref);
    }

    return React.createElement(type, newProps);
  },
);

Renderer.displayName = 'Memo(Renderer)';

export default Renderer;
