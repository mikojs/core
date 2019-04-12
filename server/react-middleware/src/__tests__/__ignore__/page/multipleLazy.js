// @flow
/* eslint-disable require-jsdoc */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';

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

export default class MultipleLazy extends React.PureComponent<*> {
  render(): NodeType {
    return <TestOne />;
  }
}
