// @flow

import { useRef, useMemo, useContext } from 'react';
import {
  useDrag,
  useDrop,
  useDragLayer,
  type monitorType,
} from 'react-dnd-cjs';
import { getElementPosition } from 'fbjs';

import SourceContext from '../SourceContext';

import { type itemType } from './useSource';

const CAN_DRAG_KIND: $ReadOnlyArray<$PropertyType<itemType, 'type'>> = [
  'only-drag',
  'drag-and-drop',
];

const CAN_DROP_KIND: $ReadOnlyArray<$PropertyType<itemType, 'type'>> = [
  'only-drop',
  'drag-and-drop',
];

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
  props?: {},
  kind?: $PropertyType<itemType, 'type'> = 'drag-and-drop',
): {} => {
  const { updateSource } = useContext(SourceContext);
  const item = { id, type: kind };
  const newProps: {
    ...typeof props,
    ref: $Call<typeof useRef, null | mixed>,
    style?: {},
  } = { ...props, ref: useRef(null) };
  const [{ isDragging }, connectDrag] = useDrag({
    item,
    collect: (monitor: monitorType) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ isOver }, connectDrop] = useDrop({
    accept: CAN_DROP_KIND,
    collect: (monitor: monitorType) => ({
      isOver: monitor.isOver(),
    }),
    hover: (current: itemType) => {
      if (current.id !== item.id) updateSource('hover', current, item);
    },
    drop: (current: itemType, monitor: monitorType) => {
      if (current.id !== item.id && monitor.isOver({ shallow: true }))
        updateSource('drop', current, item);
    },
  });
  const { isOneOfItemDragging } = useDragLayer((monitor: monitorType) => ({
    isOneOfItemDragging: monitor.isDragging(),
  }));
  const { width, height } = useMemo(
    () =>
      !newProps.ref.current
        ? { width: 0, height: 0 }
        : getElementPosition(newProps.ref.current),
    [isOneOfItemDragging, newProps.ref.current !== null],
  );

  if (CAN_DRAG_KIND.includes(item.type)) connectDrag(newProps.ref);

  if (CAN_DROP_KIND.includes(item.type)) connectDrop(newProps.ref);

  if (!isDragging && isOneOfItemDragging) {
    if (width === 0)
      newProps.style = {
        ...newProps.style,
        width: '100%',
      };

    if (height === 0)
      newProps.style = {
        ...newProps.style,
        height: '100%',
      };
  }

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
