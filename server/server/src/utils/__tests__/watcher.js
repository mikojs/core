// @flow

import { emptyFunction } from 'fbjs';

import watcher, { handler } from '../watcher';

describe('watcher', () => {
  test('watcher close', async () => {
    expect((await watcher(__dirname, emptyFunction))()).toBeUndefined();
  });

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
});
