// @flow

import { emptyFunction, ExecutionEnvironment } from 'fbjs';

import { mockChoice } from '@cat-org/utils';

import node from './node';
import browser from './browser';

export default mockChoice(
  ExecutionEnvironment.canUseEventListeners,
  emptyFunction.thatReturns(browser),
  emptyFunction.thatReturns(node),
);
