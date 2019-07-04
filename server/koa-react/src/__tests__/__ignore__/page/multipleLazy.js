// @flow

import React, { type Node as NodeType } from 'react';

import { lazy } from '../../../ReactIsomorphic';

// TODO component should be ignored
// eslint-disable-next-line jsdoc/require-jsdoc
const TestTwoComponent = () => 'multiple lazy';
const TestTwo = lazy(
  async () => ({
    default: TestTwoComponent,
  }),
  'test-lazy-2',
);

// TODO component should be ignored
// eslint-disable-next-line jsdoc/require-jsdoc
const TestOneComponent = () => <TestTwo />;
const TestOne = lazy(
  async () => ({
    default: TestOneComponent,
  }),
  'test-lazy-1',
);

/** MultipleLazy Component */
export default class MultipleLazy extends React.PureComponent<*> {
  // TODO component should be ignored
  // eslint-disable-next-line jsdoc/require-jsdoc
  render(): NodeType {
    return <TestOne />;
  }
}
