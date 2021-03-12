// @flow

import { emptyFunction } from 'fbjs';

import configs from '../configs';

const config = {
  miko: emptyFunction.thatReturnsArgument,
};

test('configs', () => {
  configs.load();
  configs.load({
    path: __filename,
    config,
  });
  configs.load({
    path: __filename,
    config: [config],
  });

  expect(configs.cache.miko('test')).toBe('test');
});
