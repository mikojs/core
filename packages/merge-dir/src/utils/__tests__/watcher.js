// @flow

import { handler } from '../watcher';

test('handler reject', async () => {
  const mockLog = jest.fn();

  global.console.warn = mockLog;

  await expect(
    new Promise((resolve, reject) =>
      handler(resolve, reject)(new Error('error'), {
        warning: 'warning',
        files: [],
      }),
    ),
  ).rejects.toThrow('error');
  expect(mockLog).toHaveBeenCalledWith('warning');
});
