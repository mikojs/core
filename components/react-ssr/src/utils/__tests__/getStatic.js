// @flow

import React from 'react';

import getStatic from '../getStatic';

/** @react test Component */
const Component = () => <div>test</div>;

/**
 */
Component.getInitialProps = () => {};

describe('get static', () => {
  test.each`
    isMemo
    ${true}
    ${false}
  `('is memo or not = $isMemo', ({ isMemo }: {| isMemo: boolean |}) => {
    expect(
      getStatic(isMemo ? React.memo(Component) : Component),
    ).toHaveProperty('getInitialProps');
  });
});
