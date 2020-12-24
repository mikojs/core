// @flow

import fs from 'fs';
import path from 'path';

import { emptyFunction } from 'fbjs';

import testingLogger from '@mikojs/logger/lib/testingLogger';

import watcher, {
  handler,
  buildSubscription,
  type eventType,
} from '../watcher';

const folder = path.resolve(__dirname, './__ignore__');

describe('watcher', () => {
  beforeEach(() => {
    testingLogger.reset();
  });

  beforeAll(() => {
    fs.mkdirSync(folder);
  });

  test('handler reject', async () => {
    await expect(
      new Promise((resolve, reject) =>
        handler(resolve, reject)(new Error('Run watcher fail.'), {
          warning: 'warning',
          files: [],
        }),
      ),
    ).rejects.toThrow('Run watcher fail.');
    expect(testingLogger.getInstance()?.lastFrame()).toMatch('warning');
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
