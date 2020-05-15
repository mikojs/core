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

type propsType = {|
  ref: $Call<typeof useRef, null | mixed>,
  style?: {},
|};

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
 * @param {itemType} item - the item for dnd
 *
 * @return {object} - the new props of the component has been injected
 */
const useDnd = (item: itemType): propsType => {
  const { updateSource } = useContext(SourceContext);
  const newProps: propsType = {
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    ...(item.getProps?.() || {}: $Diff<propsType, {| ref: mixed |}>),
    ref: useRef(null),
  };
  const [{ isDragging }, connectDrag] = useDrag({
    item,
    collect: (monitor: monitorType) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ isOver }, connectDrop] = useDrop({
    accept: CAN_DRAG_TYPE,
    collect: (monitor: monitorType) => ({
      isOver: monitor.isOver(),
    }),
    hover: (current: itemType, monitor: monitorType) => {
      if (current.id !== item.id && monitor.isOver({ shallow: true }))
        updateSource({ type: 'hover', current, target: item });
    },
    drop: (current: itemType, monitor: monitorType) => {
      if (current.id !== item.id && monitor.isOver({ shallow: true }))
        updateSource({ type: 'drop', current, target: item });
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

  if (item.type === 'none')
    newProps.style = {
      ...newProps.style,
      opacity: 0.5,
    };

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
