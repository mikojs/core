// @flow

import { useRef, useMemo, useContext } from 'react';
import {
  useDrag,
  useDrop,
  useDragLayer,
  type monitorType,
} from 'react-dnd-cjs';
import { getElementPosition } from 'fbjs';

import { SourceContext, type itemType } from '../SourceProvider';

const CAN_DROP_KIND: $ReadOnlyArray<$PropertyType<itemType, 'kind'>> = [
  'component',
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
  kind?: $PropertyType<itemType, 'kind'> = CAN_DROP_KIND[0],
): {} => {
  const { updateSource } = useContext(SourceContext);
  const newProps: {
    ...typeof props,
    ref: $Call<typeof useRef, null | mixed>,
    style?: {},
  } = { ...props, ref: useRef(null) };
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
    drop: (current: itemType, monitor: monitorType) => {
      if (current.id !== id && monitor.isOver({ shallow: true }))
        updateSource('TODO', current);
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

  connectDrag(newProps.ref);
  connectDrop(newProps.ref);

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
