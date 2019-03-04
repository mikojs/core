// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React from 'react';

import { lazy } from '../../../ReactIsomorphic';

const TestTwoComponent = () => 'multiple lazy';
const TestTwo = lazy(
  async () => ({
    default: TestTwoComponent,
  }),
  'test-lazy-2',
);

const TestOneComponent = () => <TestTwo />;
const TestOne = lazy(
  async () => ({
    default: TestOneComponent,
  }),
  'test-lazy-1',
);

export default class MultipleLazy extends React.PureComponent<{}> {
  render() {
    return <TestOne />;
  }
}
