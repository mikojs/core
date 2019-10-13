// @flow

// $FlowFixMe jest mock
import { fs } from 'fs';
// $FlowFixMe jest mock
import { net } from 'net';

import { isRunning } from 'is-running';
import rimraf from 'rimraf';

import createServer, {
  TIME_TO_CHECK,
  TIME_TO_REMOVE_FILES,
  TIME_TO_CLOSE_SERVER,
} from '../createServer';

const port = 8000;
const debugLog = jest.fn();
let dataCallback: (data: string) => void;

jest.useFakeTimers();
jest.mock('fs');
jest.mock('net');

describe('create server', () => {
  beforeAll(() => {
    createServer(port, debugLog);

    [, dataCallback] = net.callback.mock.calls.find(
      ([type]: [string]) => type === 'data',
    );
  });

  beforeEach(() => {
    debugLog.mockClear();
  });

  test.each`
    eventName   | argu                  | expected
    ${'error'}  | ${new Error('error')} | ${'error'}
    ${'listen'} | ${undefined}          | ${`(${process.pid}) Open server at ${port}`}
  `(
    'trigger $eventName',
    ({
      eventName,
      argu,
      expected,
    }: {|
      eventName: string,
      argu?: mixed,
      expected: string,
    |}) => {
      const [, callback] = net.callback.mock.calls.find(
        ([type]: [string]) => type === eventName,
      );

      callback(argu);

      expect(debugLog).toHaveBeenCalledTimes(1);
      expect(debugLog).toHaveBeenCalledWith(expected);
    },
  );

  describe('trigger data step by step', () => {
    beforeEach(() => {
      debugLog.mockClear();
      isRunning.running = true;
      fs.exist = true;
    });

    test('give the data which can not be parsed', () => {
      dataCallback('test');

      expect(debugLog).toHaveBeenCalledTimes(2);
      expect(debugLog).toHaveBeenCalledWith('test');
      expect(debugLog).toHaveBeenCalledWith(
        new SyntaxError('Unexpected token e in JSON at position 1'),
      );
    });

    test.each`
      data                                      | expected
      ${{}}                                     | ${{}}
      ${{ pid: 'pid', filePath: 'filePath' }}   | ${{ filePath: ['pid'] }}
      ${{ pid: 'pid', filePath: 'filePath' }}   | ${{ filePath: ['pid', 'pid'] }}
      ${{ pid: 'pid1', filePath: 'filePath1' }} | ${{ filePath: ['pid', 'pid'], filePath1: ['pid1'] }}
    `(
      'give the $data to the server',
      ({
        data,
        expected,
      }: {|
        data: { [string]: string },
        expected: { [string]: $ReadOnlyArray<string> },
      |}) => {
        dataCallback(JSON.stringify(data));

        expect(debugLog).toHaveBeenCalledTimes(
          Object.keys(data).length === 0 ? 1 : 2,
        );
        expect(debugLog).toHaveBeenCalledWith(JSON.stringify(data));

        if (Object.keys(data).length !== 0)
          expect(debugLog).toHaveBeenCalledWith(
            `Cache: ${JSON.stringify(expected, null, 2)}`,
          );
      },
    );

    test('check running process and keep the files exist', () => {
      jest.advanceTimersByTime(TIME_TO_CHECK);

      expect(debugLog).toHaveBeenCalledTimes(0);
    });

    test('pid process is close', () => {
      isRunning.running = false;
      jest.advanceTimersByTime(TIME_TO_CHECK + TIME_TO_REMOVE_FILES);

      expect(debugLog).toHaveBeenCalledTimes(2);
      expect(debugLog).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify(
          { filePath: [], filePath1: ['pid1'] },
          null,
          2,
        )}`,
      );
      expect(debugLog).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify({ filePath: [], filePath1: [] }, null, 2)}`,
      );

      debugLog.mockClear();
      rimraf.mock.calls.forEach(([, callback]: [string, () => void]) => {
        callback();
      });

      expect(debugLog).toHaveBeenCalledTimes(2);
      expect(debugLog).toHaveBeenCalledWith('Remove existing file: filePath');
      expect(debugLog).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify({ filePath1: [] }, null, 2)}`,
      );
    });

    test('pid1 process is close and file does not exist', () => {
      isRunning.running = false;
      fs.exist = false;
      jest.advanceTimersByTime(TIME_TO_CHECK);

      expect(debugLog).toHaveBeenCalledTimes(2);
      expect(debugLog).toHaveBeenCalledWith('File does not exist: filePath1');
      expect(debugLog).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify({}, null, 2)}`,
      );
    });

    test('close the server after the all processes are close', () => {
      jest.advanceTimersByTime(TIME_TO_CHECK + TIME_TO_CLOSE_SERVER);

      const [, closeCallback] = net.callback.mock.calls.find(
        ([type]: [string]) => type === 'close',
      );

      closeCallback();

      expect(debugLog).toHaveBeenCalledTimes(1);
      expect(debugLog).toHaveBeenCalledWith('Close server');
    });
  });
});
