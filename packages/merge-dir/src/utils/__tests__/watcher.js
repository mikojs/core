// @flow

import { emptyFunction } from 'fbjs';

import watcher, { handler } from '../watcher';

describe('watcher', () => {
  test('watcher close', async () => {
    expect(
      (await watcher(__dirname, 'build', emptyFunction))(),
    ).toBeUndefined();
  });

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
});
