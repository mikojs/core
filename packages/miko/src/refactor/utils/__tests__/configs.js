// @flow

import { emptyFunction } from 'fbjs';

import configs from '../configs';

const config = {
  miko: emptyFunction.thatReturnsArgument,
};
const expected = 'test';

test('configs', () => {
  expect(
    configs
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
