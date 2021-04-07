import commander from '@mikojs/commander';

import transform from '../transform';
import runCommands from '../runCommands';

jest.mock('../runCommands', () => jest.fn());

test('transform', async () => {
  await commander({
    ...transform({
      command: {
        description: 'description',
        arguments: '<args>',
        command: 'command',
      },
    }),
    exitOverride: true,
  }).parseAsync(['node', 'miko', 'command', '-a']);

  expect(runCommands).toHaveBeenCalledTimes(1);
  expect(runCommands).toHaveBeenCalledWith('command');
});
