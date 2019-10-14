// @flow

import { findProcess } from 'find-process';

import findMainServer from '../findMainServer';

describe('find main server', () => {
  test.each`
    result                                 | expected
    ${[]}                                  | ${null}
    ${[{ pid: process.pid, cmd: '8000' }]} | ${{ isMain: true, port: '8000' }}
    ${[{ pid: process.pid, cmd: '8000' }]} | ${{ isMain: true, port: '8000' }}
    ${[{ pid: -1, cmd: '8000' }]}          | ${{ isMain: false, port: '8000' }}
  `(
    'find main server with process = $result',
    async ({
      result,
      expected,
    }: {|
      result: $ReadOnlyArray<{| pid: number, cmd: string |}>,
      expected: ?{| isMain: boolean, port: string |},
    |}) => {
      findProcess.result = result;

      expect(await findMainServer()).toEqual(
        !expected
          ? expected
          : {
              ...expected,
              allProcesses: result,
            },
      );
    },
  );
});
