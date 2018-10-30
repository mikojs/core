// @flow

import prodLogger from '../prodLogger';

test('prod logger', () => {
  const logs = prodLogger();

  expect(logs.log()).toEqual(logs);
});
