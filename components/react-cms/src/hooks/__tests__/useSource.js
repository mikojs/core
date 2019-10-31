// @flow

import React, { useImperativeHandle } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import useSource, { type sourceType } from '../useSource';

const sourceRef = React.createRef<$Call<typeof useSource, sourceType>>();

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

  test('work', () => {
    act(() => {
      // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
      sourceRef.current // eslint-disable-line flowtype/no-unused-expressions
        ?.updateSource(
          'hover',
          { id: 'current', type: 'none' },
          { id: 'target', type: 'none' },
        );
    });

    expect(sourceRef.current?.source).toEqual([]);
  });
});
