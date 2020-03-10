// @flow

import path from 'path';

import execa from 'execa';
import getPort from 'get-port';
import findProcess from 'find-process';

import buildWorker from '../index';
import buildServer from '../utils/buildServer';

import { mockCallback } from './__ignore__/worker';

test('worker', async () => {
  let port: number;

  findProcess.mockReturnValue([]);
  execa.mockImplementation((filePath: string, [serverPort]: [number]): {|
    unref: JestMockFn<$ReadOnlyArray<void>, void>,
  |} => {
    buildServer(serverPort).unref();
    port = serverPort;

    return {
      unref: jest.fn(),
    };
  });

  const worker = await buildWorker(
    path.resolve(__dirname, './__ignore__/worker.js'),
  );

  expect(port !== (await getPort({ port }))).toBeTruthy();
  expect(await worker('test', 'send data')).toBeUndefined();
  expect(await worker('close')).toBeUndefined();
  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenCalledWith('send data');
});
