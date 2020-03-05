// @flow

import net from 'net';

import sendToServer from '../sendToServer';

jest.mock('net');
jest.unmock('find-process');
jest.useFakeTimers();

test('send to server', async () => {
  const mockCallback = jest.fn();

  await sendToServer('test', mockCallback);
  net.connect(0).on.mock.calls[0][1]('error');
  jest.runAllTimers();

  expect(net.connect(0).end.mock.calls).toEqual([['test', mockCallback]]);
});
