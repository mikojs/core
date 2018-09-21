// @flow

import { emptyFunction } from 'fbjs';

module.exports = {
  noCli: emptyFunction.thatReturnsArgument,
  runError: {
    config: emptyFunction.thatReturnsArgument,
    run: () => {
      throw new Error('run error');
    },
  },
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
