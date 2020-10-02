// @flow

import { handler } from '../watcher';

test('handler reject', () => {
  const mockLog = jest.fn();

  global.console.warn = mockLog;

  expect(
    new Promise((resolve, reject) =>
      handler(resolve, reject)(new Error('error'), { warning: 'warning' }),
    ),
  ).rejects.toThrow('error');
  expect(mockLog).toHaveBeenCalledWith('warning');
});
