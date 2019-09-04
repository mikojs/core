// @flow

import React, { useRef, useEffect, type Node as NodeType } from 'react';
import { useDrag, useDrop, type monitorType } from 'react-dnd-cjs';
import { getEmptyImage } from 'react-dnd-html5-backend-cjs';
import { ExecutionEnvironment } from 'fbjs';

import { type dndItemType, type sourceType, type contextType } from './types';

type propsType = {|
  source: sourceType,
  hover: $PropertyType<contextType, 'hover'>,
  drop: $PropertyType<contextType, 'drop'>,
|};

const CAN_MOVE_COMPONENT = ['component', 'new-component'];

/** @react render the Renderer Component for the source data */
const Renderer = React.memo<propsType>(
  ({
    source: {
      id,
      data: { kind, type, props = {}, icon },
      children = [],
    },
    hover,
    drop,
  }: propsType): NodeType => {
    const newProps = { ...props };
    const item = { id, type: kind, icon };

    if (children.length !== 0)
      newProps.children = children.map((child: sourceType) => (
        <Renderer key={child.id} source={child} hover={hover} drop={drop} />
      ));

    if (ExecutionEnvironment.canUseEventListeners) {
      newProps.ref = useRef(null);

      if (CAN_MOVE_COMPONENT.includes(kind)) {
        const [{ isDragging }, connectDrag, connectPreview] = useDrag({
          item,
          collect: (monitor: monitorType) => ({
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

        useEffect(() => {
          connectPreview(getEmptyImage(), { captureDraggingState: true });
        }, []);
      } else {
        const [{ isOver }, connectDrop] = useDrop({
          accept: CAN_MOVE_COMPONENT,
          collect: (monitor: monitorType) => ({
            isOver: monitor.isOver(),
          }),
          hover: (current: dndItemType) => {
            if (current.id !== item.id) hover(current, item);
          },
          drop: (current: dndItemType) => {
            if (current.id !== item.id) drop(current, item);
          },
        });

        if (['manager', 'previewer'].includes(kind)) newProps.isOver = isOver;

        connectDrop(newProps.ref);
      }

      if ('preview-component' === kind)
        newProps.style = {
          ...newProps.style,
          opacity: 0.5,
        };
    }

    return React.createElement(
      kind === 'new-component' ? icon : type,
      newProps,
    );
  },
);

Renderer.displayName = 'Memo(Renderer)';

export default Renderer;
