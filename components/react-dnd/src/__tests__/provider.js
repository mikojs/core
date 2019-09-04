// @flow

import { getHover, getDrop } from '../Provider';

jest.mock('uuid/v4', () => jest.fn(() => 'id'));

const previewer = {
  id: 'component',
  parentId: null,
  kind: 'component',
  type: 'div',
  icon: 'div',
};

const component = {
  id: 'new-component',
  parentId: null,
  kind: 'new-component',
  type: 'div',
  icon: 'div',
};

describe('Provider', () => {
  describe('getHover', () => {
    test('hover "new component" on "previewer"', () => {
      const mockSetPreviewer = jest.fn();

      getHover(
        [component],
        [
          {
            ...previewer,
            id: 'previewer',
          },
        ],
        mockSetPreviewer,
      )(
        {
          id: 'new-component',
          type: 'new-component',
          icon: 'div',
        },
        {
          id: 'previewer',
          type: 'previewer',
          icon: 'div',
        },
      );

      expect(mockSetPreviewer).toHaveBeenCalledWith([
        {
          ...previewer,
          id: 'previewer',
        },
        {
          ...component,
          kind: 'preview-component',
          parentId: 'previewer',
        },
      ]);
    });

    test('next: hover "new component" on "previewer" again, should remove "preview component"', () => {
      const mockSetPreviewer = jest.fn();

      getHover(
        [component],
        [
          {
            ...previewer,
            id: 'previewer',
          },
          {
            ...previewer,
            id: 'should be removed',
            kind: 'preview-component',
          },
        ],
        mockSetPreviewer,
      )(
        {
          id: 'new-component',
          type: 'new-component',
          icon: 'div',
        },
        {
          id: 'previewer',
          type: 'previewer',
          icon: 'div',
        },
      );

      expect(mockSetPreviewer).toHaveBeenCalledWith([
        {
          ...previewer,
          id: 'previewer',
        },
        {
          ...component,
          kind: 'preview-component',
          parentId: 'previewer',
        },
      ]);
    });

    test('next: hover "new component" on "manager"', () => {
      const mockSetPreviewer = jest.fn();

      getHover(
        [],
        [
          {
            ...previewer,
            kind: 'preview-component',
          },
        ],
        mockSetPreviewer,
      )(
        {
          id: 'new-component',
          type: 'new-component',
          icon: 'div',
        },
        {
          id: 'manager',
          type: 'manager',
          icon: 'div',
        },
      );

      expect(mockSetPreviewer).toHaveBeenCalledWith([]);
    });

    test('next: hover "new component" on "manager" again, should be ignored', () => {
      const mockSetPreviewer = jest.fn();

      getHover([], [], mockSetPreviewer)(
        {
          id: 'new-component',
          type: 'new-component',
          icon: 'div',
        },
        {
          id: 'manager',
          type: 'manager',
          icon: 'div',
        },
      );

      expect(mockSetPreviewer).not.toHaveBeenCalled();
    });
  });

  describe('getDrop', () => {
    test('add "new component" to "previewer"', () => {
      const mockSetPreviewer = jest.fn();

      getDrop(
        [
          previewer,
          {
            ...previewer,
            kind: 'preview-component',
          },
        ],
        mockSetPreviewer,
      )(
        {
          id: 'component',
          type: 'new-component',
          icon: 'div',
        },
        {
          id: 'previewer',
          type: 'previewer',
          icon: 'div',
        },
      );

      expect(mockSetPreviewer).toHaveBeenCalledWith([
        previewer,
        {
          ...previewer,
          id: 'id',
        },
      ]);
    });

    test('drop "component" to "manager" for removing', () => {
      const mockSetPreviewer = jest.fn();

      getDrop([previewer], mockSetPreviewer)(
        {
          id: 'component',
          type: 'component',
          icon: 'div',
        },
        {
          id: 'manager',
          type: 'manager',
          icon: 'div',
        },
      );

      expect(mockSetPreviewer).toHaveBeenCalledWith([]);
    });

    test('drop "new component" to "manager"', () => {
      const mockSetPreviewer = jest.fn();

      getDrop([], mockSetPreviewer)(
        {
          id: 'component',
          type: 'new-component',
          icon: 'div',
        },
        {
          id: 'manager',
          type: 'manager',
          icon: 'div',
        },
      );

      expect(mockSetPreviewer).not.toHaveBeenCalled();
    });
  });
});
