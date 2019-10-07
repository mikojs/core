// @flow

// $FlowFixMe jest mock
import { fs } from 'fs';
// $FlowFixMe jest mock
import { net } from 'net';

import { isRunning } from 'is-running';
import rimraf from 'rimraf';

import createServer, {
  TIME_TO_CLOSE_SERVER,
  TIME_TO_REMOVE_FILES,
  TIME_TO_CHECK,
} from '../createServer';

const debugLog = jest.fn();
const port = 8000;
let errorCallback: (error: Error) => void;
let dataCallback: (data: string) => void;
let listenCallback: () => void;

jest.mock('fs');
jest.mock('net');
jest.useFakeTimers();

/**
 * @example
 * sendData()
 */
const sendData = () => {
  net.callback.mock.calls.find(([type, callback]: [string, () => void]) => {
    if (type === 'end') callback();
  });
};

describe.each`
  mainPort
  ${port}
  ${port + 1}
`(
  'create server with mainPort = $mainPort',
  ({ mainPort }: {| mainPort: number |}) => {
    const isMain = mainPort === port;

    beforeAll(() => {
      net.callback.mockClear();
      createServer(port, debugLog, async () => mainPort);

      [, errorCallback] = net.callback.mock.calls.find(
        ([type]: [string]) => type === 'error',
      );
      [, dataCallback] = net.callback.mock.calls.find(
        ([type]: [string]) => type === 'data',
      );
      [, listenCallback] = net.callback.mock.calls.find(
        ([type]: [string]) => type === 'listen',
      );
    });

    beforeEach(() => {
      debugLog.mockClear();
    });

    test('give the data to the server first', () => {
      dataCallback(JSON.stringify({ pid: 'pid', filePath: 'filePath' }));

      expect(debugLog).toHaveBeenCalledTimes(2);
      expect(debugLog).toHaveBeenCalledWith(
        `Cache: ${JSON.stringify({ filePath: ['pid'] }, null, 2)}`,
      );
    });

    test('trigger error', () => {
      expect(errorCallback(new Error('error'))).toBeUndefined();
      expect(debugLog).toHaveBeenCalledTimes(1);
      expect(debugLog).toHaveBeenCalledWith('error');
    });

    test('tigger listen', async () => {
      expect(await listenCallback()).toBeUndefined();
      sendData();

      if (isMain) expect(debugLog).toHaveBeenCalledTimes(1);
      else {
        expect(debugLog).toHaveBeenCalledTimes(2);
        expect(debugLog).toHaveBeenCalledWith(
          'filePath has been sent to the main server',
        );
      }

      expect(debugLog).toHaveBeenCalledWith(`Open server at ${port}`);
    });

    describe('trigger data step by step', () => {
      beforeEach(() => {
        net.callback.mockClear();
        debugLog.mockClear();
        rimraf.mockClear();
        isRunning.running = true;
        fs.exist = true;
      });

      test('give the same data to the server again', () => {
        dataCallback(JSON.stringify({ pid: 'pid', filePath: 'filePath' }));
        sendData();

        expect(debugLog).toHaveBeenCalledTimes(2);

        if (isMain)
          expect(debugLog).toHaveBeenCalledWith(
            `Cache: ${JSON.stringify({ filePath: ['pid', 'pid'] }, null, 2)}`,
          );
        else
          expect(debugLog).toHaveBeenCalledWith(
            'filePath has been sent to the main server',
          );
      });

      test('give the other data to the server', () => {
        dataCallback(JSON.stringify({ pid: 'pid1', filePath: 'filePath1' }));
        sendData();

        expect(debugLog).toHaveBeenCalledTimes(2);

        if (isMain)
          expect(debugLog).toHaveBeenCalledWith(
            `Cache: ${JSON.stringify(
              { filePath: ['pid', 'pid'], filePath1: ['pid1'] },
              null,
              2,
            )}`,
          );
        else
          expect(debugLog).toHaveBeenCalledWith(
            'filePath1 has been sent to the main server',
          );
      });

      test('check running pid and keep the files exist', () => {
        jest.advanceTimersByTime(TIME_TO_CHECK);

        expect(debugLog).toHaveBeenCalledTimes(0);
      });

      test('pid is close', () => {
        isRunning.running = false;
        jest.advanceTimersByTime(TIME_TO_REMOVE_FILES);

        if (isMain) {
          expect(debugLog).toHaveBeenCalledTimes(2);
          expect(debugLog).toHaveBeenCalledWith(
            `Cache: ${JSON.stringify(
              { filePath: [], filePath1: ['pid1'] },
              null,
              2,
            )}`,
          );
          expect(debugLog).toHaveBeenCalledWith(
            `Cache: ${JSON.stringify(
              { filePath: [], filePath1: [] },
              null,
              2,
            )}`,
          );
        } else expect(debugLog).toHaveBeenCalledTimes(1);

        debugLog.mockClear();
        jest.advanceTimersByTime(TIME_TO_CHECK);

        expect(debugLog).toHaveBeenCalledTimes(0);

        rimraf.mock.calls.forEach(([, callback]: [string, () => void]) => {
          callback();
        });

        if (isMain) {
          expect(debugLog).toHaveBeenCalledTimes(2);
          expect(debugLog).toHaveBeenCalledWith(
            `Cache: ${JSON.stringify({ filePath1: [] }, null, 2)}`,
          );
        } else expect(debugLog).not.toHaveBeenCalled();
      });

      test('pid1 is close, but file does not exist', () => {
        isRunning.running = false;
        fs.exist = false;
        jest.advanceTimersByTime(TIME_TO_CHECK);

        expect(debugLog).toHaveBeenCalledTimes(2);
        expect(debugLog).toHaveBeenCalledWith(
          `Cache: ${JSON.stringify({}, null, 2)}`,
        );
      });

      test('close the server after the all pids is close', () => {
        jest.advanceTimersByTime(TIME_TO_CLOSE_SERVER);

        const [, closeCallback] = net.callback.mock.calls.find(
          ([type]: [string]) => type === 'close',
        );

        closeCallback();

        expect(debugLog).toHaveBeenCalledTimes(1);
        expect(debugLog).toHaveBeenCalledWith('Close server');
      });
    });

    test('the giving data is not correct', () => {
      dataCallback(JSON.stringify({ pid: 'pid' }));

      expect(debugLog).toHaveBeenCalledTimes(1);
    });

    test('can not parse the data', () => {
      dataCallback('test');

      expect(debugLog).toHaveBeenCalledTimes(2);
      expect(debugLog).toHaveBeenCalledWith(
        new SyntaxError('Unexpected token e in JSON at position 1'),
      );
    });
  },
);
