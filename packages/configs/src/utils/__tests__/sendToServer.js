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
    net.find('error')[1]('error');
    jest.runAllTimers();

    expect(net.find('end')[1]).toBe(mockCallback);
  });
});
