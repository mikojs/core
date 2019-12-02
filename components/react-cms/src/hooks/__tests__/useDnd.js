// @flow

import React from 'react';
import { mount } from 'enzyme';
import {
  useDrag,
  useDrop,
  useDragLayer,
  type monitorType,
} from 'react-dnd-cjs';
import { emptyFunction, getElementPosition } from 'fbjs';

import useDnd from '../useDnd';
import { type itemType } from '../useSource';

describe('use dnd', () => {
  beforeEach(() => {
    useDrag.mockClear();
    useDrop.mockClear();
    useDragLayer.mockClear();
    getElementPosition.mockClear();
  });

  test.each`
    isDragging | isOver   | isOneOfItemDragging | elementStyle                   | style
    ${false}   | ${false} | ${false}            | ${{ width: 100, height: 100 }} | ${undefined}
    ${true}    | ${false} | ${true}             | ${{ width: 100, height: 100 }} | ${{ opacity: 0.1 }}
    ${false}   | ${true}  | ${true}             | ${{ width: 100, height: 100 }} | ${{ borderBottom: '1px solid red' }}
    ${false}   | ${true}  | ${true}             | ${{ width: 0, height: 0 }}     | ${{ width: '100%', height: '100%', borderBottom: '1px solid red' }}
  `(
    'use dnd with isDragging = $isDragging, isOver = $isOver, isOneOfItemDragging = $isOneOfItemDragging',
    ({
      isDragging,
      isOver,
      isOneOfItemDragging,
      elementStyle,
      style,
    }: {|
      isDragging: boolean,
      isOver: boolean,
      isOneOfItemDragging: boolean,
      elementStyle: { width: number, height: number },
      style?: {},
    |}) => {
      /** @react use to test useDnd */
      const Root = () => (
        <>
          <div
            {...useDnd({ id: 'id', type: 'drag-and-drop', component: Root })}
          />
          <div {...useDnd({ id: 'id', type: 'none', component: Root })} />
        </>
      );

      useDrag.mockReturnValue([{ isDragging }, emptyFunction]);
      useDrop.mockReturnValue([{ isOver }, emptyFunction]);
      useDragLayer.mockReturnValue({ isOneOfItemDragging });
      getElementPosition.mockReturnValue(elementStyle);

      const wrapper = mount(<Root />);

      if (!isDragging && isOneOfItemDragging)
        expect(
          wrapper.contains(
            <div style={{ ...style, width: '100%', height: '100%' }} />,
          ),
        ).toBeTruthy();
      else expect(wrapper.contains(<div style={style} />)).toBeTruthy();

      useDrag.mock.calls.forEach(
        (option: [{ collect: (monitor: monitorType) => void }]) => {
          option[0].collect({ isDragging: jest.fn() });
        },
      );
      useDrop.mock.calls.forEach(
        (
          option: [
            {
              collect: (monitor: monitorType) => void,
              hover: (current: itemType, monitor: monitorType) => void,
              drop: (current: itemType, monitor: monitorType) => void,
            },
          ],
        ) => {
          const monitor = {
            id: 'id',
            type: 'drag-and-drop',
            component: 'div',
          };

          option[0].collect({ isOver: jest.fn() });
          option[0].hover(monitor, { isOver: () => false });
          option[0].drop(monitor, { isOver: () => false });
          option[0].hover(
            {
              ...monitor,
              id: 'new-id',
            },
            { isOver: () => true },
          );
          option[0].drop({ ...monitor, id: 'new-id' }, { isOver: () => true });
        },
      );
      useDragLayer.mock.calls.forEach(
        (option: [(monitor: monitorType) => void]) => {
          option[0]({ isDragging: jest.fn() });
        },
      );
      wrapper.setProps({ key: 'value' });

      expect(wrapper.contains(<div style={style} />)).toBeTruthy();
    },
  );
});
