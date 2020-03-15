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

  await [
    {
      type: 'start',
      filePath: eventOne,
    },
    {
      type: 'start',
      filePath: eventTwo,
    },
    {
      type: 'end',
      filePath: eventTwo,
    },
  ].reduce(
    (result: Promise<void>, data: { [string]: string }) =>
      result.then(
        () =>
          new Promise(resolve => {
            net
              .connect(port)
              .on('data', resolve)
              .write(JSON.stringify(data));
          }),
      ),
    Promise.resolve(),
  );
  jest.advanceTimersByTime(5000);

  expect(server.listening).toBeTruthy();

  await new Promise(resolve => {
    net
      .connect(port)
      .on('data', resolve)
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
