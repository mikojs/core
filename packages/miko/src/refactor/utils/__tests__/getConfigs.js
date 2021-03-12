// @flow

import { emptyFunction } from 'fbjs';

import getConfigs from '../getConfigs';

const config = {
  miko: emptyFunction.thatReturnsArgument,
};
const expected = 'test';

test('get configs', () => {
  expect(
    getConfigs()
      .load()
      .load({
        path: __filename,
        config,
      })
      .load({
        path: __filename,
        config: [config],
      })
      .cache.miko(expected),
  ).toBe(expected);
});
