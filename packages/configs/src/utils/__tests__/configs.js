// @flow

import configs from '../configs';

test('configs', () => {
  const prevConfigs = { ...configs };

  configs.loadConfig();

  expect(prevConfigs).toEqual(configs);
});
