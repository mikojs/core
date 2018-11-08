// @flow

import { emptyFunction } from 'fbjs';

module.exports = {
  // for testing config and install
  funcConfig: emptyFunction.thatReturnsArgument,
  emptyConfig: {
    alias: 'jest',
    config: emptyFunction.thatReturnsArgument,
  },

  funcMergeObject: {
    config: emptyFunction.thatReturnsArgument,
  },
  objectMergeFunc: emptyFunction.thatReturnsArgument,
  customNoConfig: {},
  defaultNoConfig: {
    config: emptyFunction.thatReturnsArgument,
  },
};
