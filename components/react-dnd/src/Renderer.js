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
    const ref = useRef(null);
    const newProps = { ...props, ref };
    const item = { id, type: kind, icon, ref };

    if (children.length !== 0)
      newProps.children = children.map((child: sourceType) => (
        <Renderer key={child.id} source={child} hover={hover} drop={drop} />
      ));

    if (ExecutionEnvironment.canUseEventListeners) {
      if (CAN_MOVE_COMPONENT.includes(kind)) {
        const [{ isDragging }, connectDrag, connectPreview] = useDrag({
          item,
          collect: (monitor: monitorType) => ({
            isDragging: monitor.isDragging(),
          }),
        });

        newProps.style = !isDragging
          ? newProps.style
          : {
              ...newProps.style,
              opacity: 0,
            };

        connectDrag(ref);
        useEffect(() => {
          connectPreview(getEmptyImage(), { captureDraggingState: true });
        }, []);

        if (kind === 'component') {
          const [, connectDrop] = useDrop({
            accept: CAN_MOVE_COMPONENT,
            hover: (current: dndItemType, monitor: monitorType) => {
              if (current.id !== item.id && monitor.isOver({ shallow: true }))
                hover(current, item);
            },
          });

          connectDrop(ref);
        }
      } else {
        const [{ isOver }, connectDrop] = useDrop({
          accept: CAN_MOVE_COMPONENT,
          collect: (monitor: monitorType) => ({
            isOver: monitor.isOver(),
          }),
          hover: (current: dndItemType, monitor: monitorType) => {
            if (current.id !== item.id && monitor.isOver({ shallow: true }))
              hover(current, item);
          },
          drop: (current: dndItemType, monitor: monitorType) => {
            if (current.id !== item.id) drop(current, item);
          },
        });

        if (['manager', 'previewer'].includes(kind)) newProps.isOver = isOver;

        connectDrop(ref);
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
