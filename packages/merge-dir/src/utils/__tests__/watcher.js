// @flow

import fs from 'fs';
import path from 'path';

import { emptyFunction } from 'fbjs';

import watcher, {
  handler,
  buildSubscription,
  type eventType,
} from '../watcher';

const folder = path.resolve(__dirname, './__ignore__');

describe('watcher', () => {
  beforeAll(() => {
    fs.mkdirSync(folder);
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

  test('build subscription', () => {
    const mockCallback = jest.fn();

    buildSubscription(
      'hash',
      mockCallback,
    )({ subscription: 'not hash', files: [] });
    buildSubscription(
      'hash',
      mockCallback,
    )({ subscription: 'hash', files: [] });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test.each`
    event
    ${'dev'}
    ${'run'}
  `('$event mode', async ({ event }: {| event: eventType |}) => {
    expect((await watcher(folder, event, emptyFunction))()).toBeUndefined();
  });

  afterAll(() => {
    fs.rmdirSync(folder);
  });
});
