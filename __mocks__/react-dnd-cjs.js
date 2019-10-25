// @flow

import { emptyFunction } from 'fbjs';

// TODO: https://github.com/react-dnd/react-dnd/issues/1540
export const useDrag = jest
  .fn<$ReadOnlyArray<void>, void>()
  .mockReturnValue([{ isDragging: false }, emptyFunction]);
export const useDrop = jest
  .fn<$ReadOnlyArray<void>, void>()
  .mockReturnValue([{ isOver: false }, emptyFunction]);
export const useDragLayer = jest
  .fn<$ReadOnlyArray<void>, void>()
  .mockReturnValue({ isOneOfItemDragging: false });
export const { DndContext, DndProvider } = jest.requireActual('react-dnd-cjs');
