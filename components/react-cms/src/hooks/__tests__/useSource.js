// @flow

import React, { useImperativeHandle } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import useSource, {
  type itemType,
  type sourceType,
  type updateSourceOptionType,
} from '../useSource';

jest.mock('uuid/v4', () => () => 'current');

const sourceRef = React.createRef<$Call<typeof useSource, sourceType>>();
const component = { type: 'div' };
const defaultExpected = { id: 'current', parentId: 'target', component };

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
    optionType | targetType               | expected
    ${'hover'} | ${'none'}                | ${[]}
    ${'hover'} | ${'drag-and-drop'}       | ${[{ ...defaultExpected, kind: 'only-drop-to-add' }]}
    ${'hover'} | ${'drag-and-drop'}       | ${[{ ...defaultExpected, kind: 'only-drop-to-add' }]}
    ${'drop'}  | ${'drag-and-drop'}       | ${[{ ...defaultExpected, kind: 'drag-and-drop' }]}
    ${'drop'}  | ${'only-drop-to-remove'} | ${[]}
  `(
    'updateSource with optionType = $optionType, currentType = $currentType, targetType = $targetType',
    ({
      optionType,
      targetType,
      expected,
    }: {|
      optionType: updateSourceOptionType,
      targetType: $PropertyType<itemType, 'type'>,
      expected: sourceType,
    |}) => {
      act(() => {
        // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
        sourceRef.current // eslint-disable-line flowtype/no-unused-expressions
          ?.updateSource(
            optionType,
            { id: 'current', type: 'drag-and-drop', component },
            { id: 'target', type: targetType, component },
          );
      });

      expect(sourceRef.current?.source).toEqual(expected);
    },
  );
});
