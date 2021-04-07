import commander from '@mikojs/commander';

import transform from '../transform';
import runCommands from '../runCommands';

jest.mock('../runCommands', () => jest.fn());

describe('transform', () => {
  beforeEach(() => {
    runCommands.mockClear();
  });

  test.each`
    argv                 | expected
    ${['custom']}        | ${[undefined]}
    ${['command', '-a']} | ${['command']}
  `('argv = $argv', async ({ argv, expected }) => {
    await commander({
      ...transform({
        command: {
          description: 'description',
          arguments: '<args>',
          command: 'command',
        },
      }),
      exitOverride: true,
    }).parseAsync(['node', 'miko', ...argv]);

    expect(runCommands).toHaveBeenCalledTimes(1);
    expect(runCommands).toHaveBeenCalledWith(...expected);
  });
});
