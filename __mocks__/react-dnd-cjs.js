// @flow

import { emptyFunction } from 'fbjs';

// TODO: https://github.com/react-dnd/react-dnd/issues/1540
export const useDrag: JestMockFn<
  $ReadOnlyArray<void>,
  [{| isDragging: boolean |}, () => void],
> = jest.fn().mockReturnValue([{ isDragging: false }, emptyFunction]);

export const useDrop: JestMockFn<
  $ReadOnlyArray<void>,
  [{| isOver: boolean |}, () => void],
> = jest.fn().mockReturnValue([{ isOver: false }, emptyFunction]);

export const useDragLayer: JestMockFn<
  $ReadOnlyArray<void>,
  {| isOneOfItemDragging: boolean |},
> = jest.fn().mockReturnValue({ isOneOfItemDragging: false });

export const { DndContext, DndProvider } = jest.requireActual('react-dnd-cjs');
