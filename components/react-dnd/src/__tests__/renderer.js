// @flow

import React from 'react';
import { mount } from 'enzyme';
import { reactDndCjs } from 'react-dnd-cjs';

import Renderer from '../Renderer';

import source from './__ignore__/source';

let count: number = 0;

reactDndCjs.monitor = {
  isDragging: (): boolean => {
    count += 1;

    return Boolean(count % 2);
  },
};

const mockHover = jest.fn();
const mockDrop = jest.fn();

describe('Renderer', () => {
  beforeAll(() => {
    mount(<Renderer source={source} hover={mockHover} drop={mockDrop} />);
  });

  test('hover work', () => {
    reactDndCjs.drop.hover({ id: 'preview-component' });

    expect(mockHover).not.toHaveBeenCalled();

    reactDndCjs.drop.hover({ id: 'hover' });

    expect(mockHover).toHaveBeenCalled();
  });

  test('drop work', () => {
    reactDndCjs.drop.drop({ id: 'preview-component' });

    expect(mockDrop).not.toHaveBeenCalled();

    reactDndCjs.drop.drop({ id: 'drop' });

    expect(mockDrop).toHaveBeenCalled();
  });
});
