// @flow

import React, { type ComponentType } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import getStatic, { hoistNonReactStaticsHotExported } from '../getStatic';

/** @react Example Component */
const Example = () => <div>test</div>;

Example.key = 'value';

const MemoExample = React.memo<{||}>(Example);

/** use to test react-hot-loader/root */
class ExportedComponent extends React.Component<{||}> {
  /** @react */
  render(): null {
    return null;
  }
}

/**
 * @example
 * hot(Component, true)
 *
 * @param {ComponentType} Component - component to test
 * @param {boolean} isDev - is dev or not
 *
 * @return {ExportedComponent} - exported component
 */
const hot = (
  Component: ComponentType<*>,
  isDev: boolean,
): typeof ExportedComponent => {
  if (isDev) hoistNonReactStatics(ExportedComponent, Component);

  return ExportedComponent;
};

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
        getStatic(
          hot(
            // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/8145
            hoistNonReactStaticsHotExported(MemoExample, isDev),
            isDev,
          ),
        ).key,
      ).toBe('value');
    },
  );
});
