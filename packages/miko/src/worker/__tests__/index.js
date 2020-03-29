// @flow

import path from 'path';

import isRunning from 'is-running';
import rimraf from 'rimraf';

import buildWorker from '@mikojs/worker';

import * as worker from '../index';
import {
  TIME_TO_CHECK,
  TIME_TO_REMOVE_FILES,
  TIME_TO_CLOSE_SERVER,
} from '../checkingTimer';

const notExistingFilePath = path.resolve(__dirname, 'not-existing');

jest.useFakeTimers();
jest.mock('@mikojs/worker', () => ({
  end: jest.fn(),
}));

describe('worker', () => {
  describe('addTracking', () => {
    beforeEach(() => {
      isRunning.mockClear();
      rimraf.mockClear();
    });

    test.each`
      info                               | filePath               | expected
      ${'add existing file path'}        | ${__filename}          | ${[__filename]}
      ${'add existing file path twice'}  | ${__filename}          | ${[__filename]}
      ${'add not existing file path'}    | ${notExistingFilePath} | ${[__filename, notExistingFilePath]}
      ${'remove existing file path'}     | ${undefined}           | ${[notExistingFilePath]}
      ${'remove not existing file path'} | ${undefined}           | ${[]}
      ${'close server'}                  | ${undefined}           | ${[]}
    `(
      '$info',
      ({
        info,
        filePath,
        expected,
      }: {|
        info: string,
        filePath: ?string,
        expected: $ReadOnlyArray<string>,
      |}) => {
        if (!filePath) {
          isRunning.mockReturnValue(false);
          jest.advanceTimersByTime(TIME_TO_CHECK + TIME_TO_REMOVE_FILES);
          rimraf.mock.calls.forEach(([, callback]: [string, () => void]) => {
            callback();
          });

          if (info === 'remove existing file path')
            expect(rimraf).toHaveBeenCalledTimes(1);
          else if (info === 'close server') {
            jest.advanceTimersByTime(
              TIME_TO_CLOSE_SERVER - TIME_TO_REMOVE_FILES,
            );

            expect(buildWorker.end).toHaveBeenCalledTimes(1);
            expect(buildWorker.end).toHaveBeenCalledWith(
              path.resolve(__dirname, '../index.js'),
            );
          }
        } else expect(worker.addTracking(1, filePath)).toBeUndefined();

        expect(worker.cache.getFilePaths()).toEqual(expected);
      },
    );
  });

  test('killAllEvents', async () => {
    expect(await worker.killAllEvents()).toBeUndefined();
  });
});
