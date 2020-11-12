// @flow

import parseArgv from '../parseArgv';

test('parse argv', async () => {
  expect(
    (
      await parseArgv(
        {
          command: {
            command: 'command',
            description: 'description',
          },
        },
        ['node', 'miko', 'lint-staged'],
      )
    ).slice(0, -1),
  ).toEqual([['lint-staged']]);
});
