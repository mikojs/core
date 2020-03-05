// @flow

import findProcess from 'find-process';

import findRootProcess from '../findRootProcess';

test('find root process', async () => {
  const expected = {
    pid: 0,
    ppid: 1,
    name: 'node',
    cmd: `root, ${__filename}`,
  };

  findProcess
    .mockReturnValueOnce([expected])
    .mockReturnValueOnce([
      {
        ...expected,
        cmd: 'shell',
      },
    ])
    .mockReturnValueOnce([]);

  expect(await findRootProcess(__filename)).toEqual(expected);
});
