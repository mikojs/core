// @flow

// $FlowFixMe jest mock
import { net } from 'net';

import sendToServer from '../sendToServer';

jest.mock('net');
jest.useFakeTimers();

describe('send to server', () => {
  beforeEach(() => {
    net.callback.mockClear();
  });

  test('send the message to the server', async () => {
    const mockCallback = jest.fn();

    await sendToServer('test', mockCallback);

    const [, errorCallback] = net.callback.mock.calls.find(
      ([type]: [string]) => type === 'error',
    );

    errorCallback('error');
    jest.runAllTimers();

    const [, endCallback] = net.callback.mock.calls.find(
      ([type]: [string]) => type === 'end',
    );

    expect(endCallback).toBe(mockCallback);
  });
});
