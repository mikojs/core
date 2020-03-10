// @flow

import path from 'path';

import execa from 'execa';
import getPort from 'get-port';
import findProcess from 'find-process';

import buildWorker from '../index';
import buildServer from '../utils/buildServer';

import { start, func, end } from './__ignore__/worker';

test('worker', async () => {
  let port: number;

  func
    .mockReturnValueOnce('test')
    .mockReturnValueOnce(undefined)
    .mockReturnValueOnce(null);
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
  expect(await worker.func()).toBe('test');
  expect(await worker.func()).toBeUndefined();
  expect(await worker.func()).toBeNull();
  expect(await worker.end()).toBeUndefined();
  expect(start).not.toHaveBeenCalled();
  expect(end).not.toHaveBeenCalled();
  expect(func).toHaveBeenCalledTimes(3);
});
