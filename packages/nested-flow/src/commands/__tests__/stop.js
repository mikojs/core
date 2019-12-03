// @flow

import stop from '../stop';

test('stop', async () => {
  const mockLog = jest.fn();

  global.console.log = mockLog;

  expect(await stop(['flow', 'stop'], __dirname)).toBeUndefined();
  expect(mockLog).toHaveBeenCalled();
});
