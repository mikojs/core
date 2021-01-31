// @flow

import path from 'path';
import stream from 'stream';

import execa from 'execa';
import getPort from 'get-port';
import findProcess from 'find-process';

import buildWorker from '../index';
import buildServer from '../utils/buildServer';

import { start, func, end } from './__ignore__/worker';
import typeof * as workerType from './__ignore__/worker';

describe('worker', () => {
  describe('main server', () => {
    let port: number;
    let worker: { ...workerType, end: () => Promise<void> };

    beforeAll(async () => {
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

      worker = await buildWorker<workerType>(
        path.resolve(__dirname, './__ignore__/worker.js'),
      );
    });

    test('start', async () => {
      expect(port !== (await getPort({ port }))).toBeTruthy();
    });

    test.each`
      expected
      ${{ key: 'value' }}
      ${['test']}
      ${'test'}
      ${'-1'}
      ${'0'}
      ${'1'}
      ${-1}
      ${0}
      ${1}
      ${true}
      ${false}
      ${undefined}
      ${null}
    `(
      'func with expected = $expected',
      async ({ expected }: {| expected: mixed |}) => {
        func.mockReturnValueOnce(expected);

        expect(await worker.func()).toEqual(expected);
      },
    );

    test('func with stdout', async () => {
      const output = [];
      const expected = 'test;foo bar 123';

      func.mockImplementationOnce((stdout: stream$Writable) => {
        stdout.write(expected);
      });

      expect(
        await worker.func(
          new stream.Writable({
            /**
             * @param {Buffer} chunk - pipline chunk
             * @param {string} encoding - encoding type
             * @param {Function} callback - callback function
             */
            write: (
              chunk: Buffer | string,
              encoding: string,
              callback: () => void,
            ) => {
              if (Buffer.isBuffer(chunk)) output.push(chunk.toString());

              callback();
            },
          }),
        ),
      ).toBeUndefined();
      expect(output).toEqual(expected.split(''));
    });

    test('func with error', async () => {
      const errorMessage = 'Run function fail.';

      func.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(worker.func()).rejects.toThrow(errorMessage);
    });

    test('end', async () => {
      expect(await worker.end()).toBeUndefined();
    });

    test('final count', () => {
      expect(start).not.toHaveBeenCalled();
      expect(func).toHaveBeenCalledTimes(13 + 2);
      expect(end).not.toHaveBeenCalled();
    });
  });

  test('not main server', async () => {
    findProcess.mockReturnValue([
      { cmd: (await getPort()).toString(), pid: 1 },
    ]);

    await expect(
      buildWorker<workerType>(
        path.resolve(__dirname, './__ignore__/worker.js'),
        40,
      ),
    ).rejects.toThrow('Timeout');
    await expect(
      buildWorker<workerType>(
        path.resolve(__dirname, './__ignore__/worker.js'),
        40,
      ),
    ).rejects.toThrow('Timeout');
  });
});
