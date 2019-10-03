// @flow

// $FlowFixMe jest mock
import { fs } from 'fs';
// $FlowFixMe jest mock
import { net } from 'net';

import { debug } from 'debug';
import { isRunning } from 'is-running';
import rimraf from 'rimraf';

import createServer, {
  TIME_TO_CLOSE_SERVER,
  TIME_TO_REMOVE_FILES,
  TIME_TO_CHECK,
} from '../createServer';

jest.mock('fs');
jest.mock('net');
jest.mock('debug', (): {|
  __esModule: boolean,
  debug: JestMockFn<$ReadOnlyArray<void>, void>,
  default: () => JestMockFn<$ReadOnlyArray<void>, void>,
|} => {
  const mockDebug = jest.fn();

  return {
    __esModule: true,
    debug: mockDebug,
    default: () => mockDebug,
  };
});
jest.useFakeTimers();
createServer(8000);

const [, errorCallback] = net.callback.mock.calls.find(
  ([type]: [string]) => type === 'error',
);
const [, dataCallback] = net.callback.mock.calls.find(
  ([type]: [string]) => type === 'data',
);
const [, listenCallback] = net.callback.mock.calls.find(
  ([type]: [string]) => type === 8000,
);

describe('create server', () => {
  beforeEach(() => {
    debug.mockClear();
  });

  test('trigger error', () => {
    expect(errorCallback('error')).toBeUndefined();
  });

  test('tigger listen', () => {
    expect(listenCallback()).toBeUndefined();
  });

  describe('trigger data step by step', () => {
    beforeEach(() => {
      debug.mockClear();
      rimraf.mockClear();
      isRunning.running = true;
      fs.exist = true;
    });

    test('give the data to the server', () => {
      dataCallback(JSON.stringify({ pid: 'pid', filePath: 'filePath' }));

      expect(debug).toHaveBeenCalledTimes(2);
      expect(debug).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify({ filePath: ['pid'] }, null, 2)}`,
      );
    });

    test('give the same data to the server again', () => {
      dataCallback(JSON.stringify({ pid: 'pid', filePath: 'filePath' }));

      expect(debug).toHaveBeenCalledTimes(2);
      expect(debug).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify({ filePath: ['pid', 'pid'] }, null, 2)}`,
      );
    });

    test('give the data to the server again', () => {
      dataCallback(JSON.stringify({ pid: 'pid1', filePath: 'filePath1' }));

      expect(debug).toHaveBeenCalledTimes(2);
      expect(debug).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify(
          { filePath: ['pid', 'pid'], filePath1: ['pid1'] },
          null,
          2,
        )}`,
      );
    });

    test('check running pid and keep the files exist', () => {
      jest.advanceTimersByTime(TIME_TO_CHECK);

      expect(debug).toHaveBeenCalledTimes(0);
    });

    test('pid is close', () => {
      isRunning.running = false;
      jest.advanceTimersByTime(TIME_TO_REMOVE_FILES);

      expect(debug).toHaveBeenCalledTimes(2);
      expect(debug).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify(
          { filePath: [], filePath1: ['pid1'] },
          null,
          2,
        )}`,
      );
      expect(debug).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify({ filePath: [], filePath1: [] }, null, 2)}`,
      );

      debug.mockClear();
      jest.advanceTimersByTime(TIME_TO_CHECK);

      expect(debug).toHaveBeenCalledTimes(0);

      rimraf.mock.calls.forEach(([, callback]: [string, () => void]) => {
        callback();
      });

      expect(debug).toHaveBeenCalledTimes(2);
      expect(debug).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify({ filePath1: [] }, null, 2)}`,
      );
    });

    test('pid1 is close, but file does not exist', () => {
      isRunning.running = false;
      fs.exist = false;
      jest.advanceTimersByTime(TIME_TO_CHECK);

      rimraf.mock.calls.forEach(([, callback]: [string, () => void]) => {
        callback();
      });

      expect(debug).toHaveBeenCalledTimes(2);
      expect(debug).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify({}, null, 2)}`,
      );
    });

    test('close the server after the all pids is close', () => {
      jest.advanceTimersByTime(TIME_TO_CLOSE_SERVER);

      const [, closeCallback] = net.callback.mock.calls.find(
        ([type]: [string]) => type === 'close',
      );

      closeCallback();

      expect(debug).toHaveBeenCalledTimes(1);
      expect(debug).toHaveBeenCalledWith('Close server');
    });
  });

  test('the giving data is not correct', () => {
    dataCallback(JSON.stringify({ pid: 'pid' }));

    expect(debug).toHaveBeenCalledTimes(1);
  });

  test('can not parse the data', () => {
    dataCallback('test');

    expect(debug).toHaveBeenCalledTimes(2);
    expect(debug).toHaveBeenCalledWith(
      new SyntaxError('Unexpected token e in JSON at position 1'),
    );
  });
});
