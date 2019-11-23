// @flow

import React, { useImperativeHandle } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import useSource, {
  type itemType,
  type sourceType,
  type actionType,
} from '../useSource';

jest.mock('uuid/v4', () => () => 'current');

const sourceRef = React.createRef<$Call<typeof useSource, sourceType>>();
const defaultExpected = { id: 'current', parentId: 'target', component: 'div' };

describe('use source', () => {
  beforeAll(() => {
    const Root = React.forwardRef(
      (
        props: {},
        ref:
          | { current: null | $Call<typeof useSource, sourceType>, ... }
          | ((null | $Call<typeof useSource, sourceType>) => mixed),
      ): null => {
        const { source, updateSource } = useSource([]);

        useImperativeHandle(ref, () => ({
          source,
          updateSource,
        }));

        return null;
      },
    );

    mount(<Root ref={sourceRef} />);
  });

  test.each`
    type       | currentId | targetType               | expected
    ${'hover'} | ${null}   | ${'none'}                | ${[]}
    ${'hover'} | ${null}   | ${'drag-and-drop'}       | ${[{ ...defaultExpected, type: 'none' }]}
    ${'hover'} | ${null}   | ${'drag-and-drop'}       | ${[{ ...defaultExpected, type: 'none' }]}
    ${'drop'}  | ${null}   | ${'drag-and-drop'}       | ${[{ ...defaultExpected, type: 'drag-and-drop' }]}
    ${'drop'}  | ${null}   | ${'drag-and-drop'}       | ${[{ ...defaultExpected, type: 'drag-and-drop' }]}
    ${'drop'}  | ${null}   | ${'only-drop-to-remove'} | ${[]}
  `(
    'updateSource with type = $type, currentId = $currentId, targetType = $targetType',
    ({
      type,
      currentId,
      targetType,
      expected,
    }: {|
      type: actionType,
      currentId: string,
      targetType: $PropertyType<itemType, 'type'>,
      expected: sourceType,
    |}) => {
      act(() => {
        // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
        sourceRef.current // eslint-disable-line flowtype/no-unused-expressions
          ?.updateSource({
            type,
            current: {
              id: currentId || 'current',
              type: 'drag-and-drop',
              component: 'div',
            },
            target: { id: 'target', type: targetType, component: 'div' },
          });
      });

      expect(sourceRef.current?.source).toEqual(expected);
    },
  );
});
