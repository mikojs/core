// @flow

import { createRef } from 'react';

import { getHover, getDrop } from '../Provider';
import { type kindType } from '../types';

jest.mock('uuid/v4', () => jest.fn(() => 'id'));

/**
 * @example
 * getComponent('component')
 *
 * @param {kindType} kind - kind of component
 * @param {string} id - id of component
 * @param {string} parentId - parent id of component
 *
 * @return {object} - component data
 */
const getComponent = (
  kind: kindType,
  id: string = kind,
  parentId: ?string = null,
) => ({
  id,
  parentId,
  kind,
  type: 'div',
  icon: 'div',
});

/**
 * @example
 * getItem('component')
 *
 * @param {kindType} kind - kind of component
 *
 * @return {object} item data
 */
const getItem = (kind: kindType) => ({
  id: kind,
  type: kind,
  icon: 'div',
  ref: createRef(),
});

describe('Provider', () => {
  describe('getHover', () => {
    test('hover "new component" on "previewer"', () => {
      const mockSetPreviewer = jest.fn();

      getHover(
        [getComponent('new-component')],
        [getComponent('previewer')],
        mockSetPreviewer,
      )(getItem('new-component'), getItem('previewer'));

      expect(mockSetPreviewer).toHaveBeenCalledWith([
        getComponent('previewer'),
        getComponent('preview-component', 'new-component', 'previewer'),
      ]);
    });

    test('next: hover "new component" on "previewer" again, should remove "preview component"', () => {
      const mockSetPreviewer = jest.fn();

      getHover(
        [getComponent('new-component')],
        [
          getComponent('previewer'),
          getComponent('preview-component', 'should be removed', 'previewer'),
        ],
        mockSetPreviewer,
      )(getItem('new-component'), getItem('previewer'));

      expect(mockSetPreviewer).toHaveBeenCalledWith([
        getComponent('previewer'),
        getComponent('preview-component', 'new-component', 'previewer'),
      ]);
    });

    test('next: hover "new component" on "manager"', () => {
      const mockSetPreviewer = jest.fn();

      getHover([], [getComponent('preview-component')], mockSetPreviewer)(
        getItem('new-component'),
        getItem('manager'),
      );

      expect(mockSetPreviewer).toHaveBeenCalledWith([]);
    });

    test('next: hover "new component" on "manager" again, should be ignored', () => {
      const mockSetPreviewer = jest.fn();

      getHover([], [], mockSetPreviewer)(
        getItem('new-component'),
        getItem('manager'),
      );

      expect(mockSetPreviewer).not.toHaveBeenCalled();
    });
  });

  describe('getDrop', () => {
    test('add "new component" to "previewer"', () => {
      const mockSetPreviewer = jest.fn();

      getDrop(
        [
          getComponent('previewer'),
          getComponent('preview-component', 'new-component', 'previewer'),
        ],
        mockSetPreviewer,
      )(getItem('new-component'), getItem('previewer'));

      expect(mockSetPreviewer).toHaveBeenCalledWith([
        getComponent('previewer'),
        getComponent('component', 'id', 'previewer'),
      ]);
    });

    test('drop "component" to "manager" for removing', () => {
      const mockSetPreviewer = jest.fn();

      getDrop([getComponent('component')], mockSetPreviewer)(
        getItem('component'),
        getItem('manager'),
      );

      expect(mockSetPreviewer).toHaveBeenCalledWith([]);
    });

    test('drop "new component" to "manager"', () => {
      const mockSetPreviewer = jest.fn();

      getDrop([], mockSetPreviewer)(
        getItem('new-component'),
        getItem('manager'),
      );

      expect(mockSetPreviewer).not.toHaveBeenCalled();
    });
  });
});
