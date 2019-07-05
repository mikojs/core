// @flow

import React, { type Node as NodeType } from 'react';

import { lazy } from '../../../ReactIsomorphic';

/** @react lazy component two */
const TestTwoComponent = () => 'multiple lazy';
const TestTwo = lazy(
  async () => ({
    default: TestTwoComponent,
  }),
  'test-lazy-2',
);

/** @react lazy component one */
const TestOneComponent = () => <TestTwo />;
const TestOne = lazy(
  async () => ({
    default: TestOneComponent,
  }),
  'test-lazy-1',
);

/** MultipleLazy Component */
export default class MultipleLazy extends React.PureComponent<*> {
  /** @react */
  render(): NodeType {
    return <TestOne />;
  }
}
