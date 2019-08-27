// @flow

import React from 'react';

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

/** @react MultipleLazy Component */
const MultipleLazy = () => <TestOne />;

export default React.memo<{||}>(MultipleLazy);
