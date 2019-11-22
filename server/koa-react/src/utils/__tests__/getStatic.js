// @flow

import React from 'react';

import getStatic, { hoistNonReactStaticsHotExported } from '../getStatic';

/** @react Example Component */
const Example = () => <div>test</div>;

Example.key = 'value';

const MemoExample = React.memo<{||}>(Example);

describe('get static', () => {
  test.each`
    isDev
    ${true}
    ${false}
  `(
    'can get static from react.memo when isDev = $isDev',
    ({ isDev }: {| isDev: boolean |}) => {
      expect(
        // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/8145
        getStatic(hoistNonReactStaticsHotExported(MemoExample, isDev)).key,
      ).toBe('value');
    },
  );
});
