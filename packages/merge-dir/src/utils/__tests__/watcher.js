// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import watcher, { handler } from '../watcher';

const folder = path.resolve(__dirname, './__ignore__');

describe('watcher', () => {
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

  test('run mode', async () => {
    expect((await watcher(folder, 'run', emptyFunction))()).toBeUndefined();
  });
});
