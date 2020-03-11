// @flow

import path from 'path';

import execa from 'execa';
import getPort from 'get-port';
import findProcess from 'find-process';

import buildWorker from '../index';
import buildServer from '../utils/buildServer';

import { start, func, end, error } from './__ignore__/worker';

describe('worker', () => {
  test('main server', async () => {
    let port: number;

    func
      .mockReturnValueOnce({ key: 'value' })
      .mockReturnValueOnce('test')
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(null)
      .mockImplementation(() => {
        throw new Error('error');
      });
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
    expect(await worker.func()).toEqual({ key: 'value' });
    expect(await worker.func()).toBe('test');
    expect(await worker.func()).toBeUndefined();
    expect(await worker.func()).toBeNull();
    expect(await worker.func()).toBeUndefined();
    expect(await worker.end()).toBeUndefined();
    expect(start).not.toHaveBeenCalled();
    expect(end).not.toHaveBeenCalled();
    expect(func).toHaveBeenCalledTimes(5);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(new Error('error'));
  });

  test('not main server', async () => {
    findProcess.mockReturnValue([{ cmd: `${await getPort()}`, pid: 1 }]);

    await expect(
      buildWorker(path.resolve(__dirname, './__ignore__/worker.js'), 40),
    ).rejects.toThrow('Timeout');
    await expect(
      buildWorker(path.resolve(__dirname, './__ignore__/worker.js'), 40),
    ).rejects.toThrow('Timeout');
  });
});
