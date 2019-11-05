// @flow

import { useRef, useMemo, useContext } from 'react';
import {
  useDrag,
  useDrop,
  useDragLayer,
  type monitorType,
} from 'react-dnd-cjs';
import { emptyFunction, getElementPosition } from 'fbjs';

import SourceContext from '../SourceContext';

import { type itemType } from './useSource';

const CAN_DRAG_TYPE: $ReadOnlyArray<$PropertyType<itemType, 'type'>> = [
  'only-drag',
  'drag-and-drop',
];

const CAN_DROP_TYPE: $ReadOnlyArray<$PropertyType<itemType, 'type'>> = [
  'only-drop-to-add',
  'only-drop-to-remove',
  'drag-and-drop',
];

/**
 * @example
 * useDnd({ id: 'id', type: 'drag-and-drop', component: 'div' })
 *
 * @param {itemType} item - the item for dnd
 *
 * @return {object} - the new props of the component has been injected
 */
const useDnd = (item: itemType): {} => {
  const { updateSource } = useContext(SourceContext);
  const newProps: {
    ref: $Call<typeof useRef, null | mixed>,
    style?: {},
  } = {
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    ...(item.getProps?.() || {}),
    ref: useRef(null),
  };
  const [{ isDragging }, connectDrag] = !CAN_DRAG_TYPE.includes(item.type)
    ? [{ isDragging: false }, emptyFunction]
    : useDrag({
        item,
        collect: (monitor: monitorType) => ({
          isDragging: monitor.isDragging(),
        }),
      });
  const [{ isOver }, connectDrop] = !CAN_DROP_TYPE.includes(item.type)
    ? [{ isOver: false }, emptyFunction]
    : useDrop({
        accept: CAN_DRAG_TYPE,
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

  if (CAN_DRAG_TYPE.includes(item.type)) connectDrag(newProps.ref);

  if (CAN_DROP_TYPE.includes(item.type)) connectDrop(newProps.ref);

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

export default useDnd;
