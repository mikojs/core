// $FlowFixMe jest mock
import { net } from 'net';

import sendToServer from '../sendToServer';

jest.mock('net');
jest.useFakeTimers();

describe('send to server', () => {
  beforeEach(() => {
    net.callback.mockClear();
  });

  test.each`
    eventName
    ${'once'}
    ${'end'}
  `(
    'send the message to the server with eventName = $eventName',
    ({ eventName }: {| eventName: string |}) => {
      const mockFn = jest.fn();

      sendToServer(8000)[eventName]('test', mockFn);
      net.callback.mock.calls.forEach(
        ([type, callback]: [string, () => void]) => {
          if (type === eventName) expect(callback()).toBeUndefined();
        },
      );

      expect(mockFn).toHaveBeenCalledTimes(1);
    },
  );

  test('re-send the message to the server', () => {
    sendToServer(8000).end('test', jest.fn());

    const mockCalls = net.callback.mock.calls;
    const [, errorCallback] = net.callback.mock.calls.find(
      ([type]: [string]) => type === 'error',
    );

    net.callback.mockClear();
    errorCallback('error');
    jest.runAllTimers();

    expect(net.callback).toHaveBeenCalledTimes(mockCalls.length);

    net.callback.mock.calls.forEach(
      (mock: [string, () => void], index: number) => {
        if (mock[0] !== 'error') expect(mock[1]()).toBeUndefined();

        expect(net.callback).toHaveBeenNthCalledWith(index + 1, ...mock);
      },
    );
  });

  test('can not connect to the server', () => {
    sendToServer(8000, 50).end('test', jest.fn());

    const [, errorCallback] = net.callback.mock.calls.find(
      ([type]: [string]) => type === 'error',
    );

    expect(() => {
      errorCallback('error');
    }).toThrow('Can not connect to the server');
  });
});
