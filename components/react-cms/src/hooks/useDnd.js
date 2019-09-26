// @flow

import { useRef } from 'react';
import { useDrag, useDrop, type monitorType } from 'react-dnd-cjs';

const CAN_DROP_KIND = ['component'];

/**
 * @example
 * useDnd({}, 'id')
 *
 * @param {string} id - the id of the component
 * @param {object} props - the props of the component
 * @param {string} kind - the kind of the component
 *
 * @return {object} - the new props of the component has been injected
 */
export default (
  id: string,
  props?: {
    ref?: mixed,
    style?: {},
  },
  kind?: $ElementType<typeof CAN_DROP_KIND, number> = CAN_DROP_KIND[0],
): {} => {
  const newProps = { ...props, ref: useRef(null) };
  const [{ isDragging }, connectDrag] = useDrag({
    item: { id, type: kind },
    collect: (monitor: monitorType) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ isOver }, connectDrop] = useDrop({
    accept: CAN_DROP_KIND,
    collect: (monitor: monitorType) => ({
      isOver: monitor.isOver(),
    }),
    /*
    drop: (current: itemType, monitor: monitorType) => {
      if (current.id !== id && monitor.isOver({ shallow: true }))
        emptyFunction('drop', current);
    },
    */
  });

  connectDrag(newProps.ref);
  connectDrop(newProps.ref);

  if (isDragging)
    newProps.style = {
      ...newProps.style,
      opacity: 0.1,
    };
  else if (isOver)
    newProps.style = {
      ...newProps.style,
      borderBottom: '1px solid red',
    };

  return newProps;
};
