// @flow

import { emptyFunction } from 'fbjs';

// TODO: https://github.com/react-dnd/react-dnd/issues/1540
export const useDrag = jest
  .fn()
  .mockReturnValue([{ isDragging: false }, emptyFunction]);

export const useDrop = jest
  .fn()
  .mockReturnValue([{ isOver: false }, emptyFunction]);

export const useDragLayer = jest
  .fn()
  .mockReturnValue({ isOneOfItemDragging: false });

export const { DndContext, DndProvider } = jest.requireActual('react-dnd-cjs');
