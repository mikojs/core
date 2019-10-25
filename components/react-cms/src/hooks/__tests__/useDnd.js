// @flow

import React from 'react';
import { mount } from 'enzyme';
import {
  useDrag,
  useDrop,
  useDragLayer,
  type monitorType,
} from 'react-dnd-cjs';
import { emptyFunction } from 'fbjs';

import useDnd from '../useDnd';

describe('use dnd', () => {
  beforeEach(() => {
    useDrag.mockReset();
    useDrop.mockReset();
    useDragLayer.mockReset();
  });

  test.each`
    isDragging | isOver   | isOneOfItemDragging | style
    ${false}   | ${false} | ${false}            | ${undefined}
    ${true}    | ${false} | ${true}             | ${{ opacity: 0.1 }}
    ${false}   | ${true}  | ${true}             | ${{ width: '100%', height: '100%', borderBottom: '1px solid red' }}
  `(
    'use dnd with isDragging = $isDragging, isOver = $isOver, isOneOfItemDragging = $isOneOfItemDragging',
    ({
      isDragging,
      isOver,
      isOneOfItemDragging,
      style,
    }: {|
      isDragging: boolean,
      isOver: boolean,
      isOneOfItemDragging: boolean,
      style?: {},
    |}) => {
      /** @react use to test useDnd */
      const Root = () => <div {...useDnd('id')} />;

      useDrag.mockReturnValueOnce([{ isDragging }, emptyFunction]);
      useDrop.mockReturnValueOnce([{ isOver }, emptyFunction]);
      useDragLayer.mockReturnValueOnce({ isOneOfItemDragging });

      expect(mount(<Root />).contains(<div style={style} />)).toBeTruthy();

      useDrag.mock.calls.forEach(
        (option: [{ collect: (monitor: monitorType) => void }]) => {
          option[0].collect({ isDragging: jest.fn() });
        },
      );

      useDrop.mock.calls.forEach(
        (option: [{ collect: (monitor: monitorType) => void }]) => {
          option[0].collect({ isOver: jest.fn() });
        },
      );
    },
  );
});
