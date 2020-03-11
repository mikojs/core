// @flow

import net from 'net';
import path from 'path';

import getPort from 'get-port';

import buildServer from '../buildServer';

jest.useFakeTimers();

test('build server', async () => {
  const port = await getPort();
  const server = buildServer(port);
  const eventOne = path.resolve(__dirname, '../buildServer.js');
  const eventTwo = path.resolve(__dirname, '../sendToServer.js');

  expect(server.listening).toBeTruthy();

  await new Promise(resolve => {
    net.connect(port).end(
      JSON.stringify({
        type: 'start',
        filePath: eventOne,
      }),
    );
    net.connect(port).end(
      JSON.stringify({
        type: 'start',
        filePath: eventTwo,
      }),
    );
    net
      .connect(port)
      .on('end', resolve)
      .write(
        JSON.stringify({
          type: 'end',
          filePath: eventTwo,
        }),
      );
  });
  jest.advanceTimersByTime(5000);

  expect(server.listening).toBeTruthy();

  await new Promise(resolve => {
    net
      .connect(port)
      .on('end', resolve)
      .write(
        JSON.stringify({
          type: 'end',
          filePath: eventOne,
        }),
      );
  });
  jest.advanceTimersByTime(5000);

  expect(server.listening).toBeFalsy();
});
