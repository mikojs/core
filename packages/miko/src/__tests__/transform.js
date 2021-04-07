import commander from '@mikojs/commander';

import transform from '../transform';
import runCommands from '../runCommands';

const defaultConfig = {
  description: 'description',
  options: [
    {
      flags: '-o',
      description: 'description',
    },
  ],
};

jest.mock('../runCommands', () => jest.fn());

describe('transform', () => {
  beforeEach(() => {
    runCommands.mockClear();
  });

  test.each`
    argv                       | expected
    ${['custom', '-o']}        | ${['custom', '-o']}
    ${['command', '-o', '-a']} | ${['command', '-o', '-a']}
  `('argv = $argv', async ({ argv, expected }) => {
    await commander(
      transform({
        ...defaultConfig,
        name: 'name',
        version: '1.0.0',
        arguments: '<args...>',
        exitOverride: true,
        commands: {
          command: {
            ...defaultConfig,
            arguments: '<args>',
            command: 'command',
          },
        },
      }),
    ).parseAsync(['node', 'miko', ...argv]);

    expect(runCommands).toHaveBeenCalledTimes(1);
    expect(runCommands).toHaveBeenCalledWith(...expected);
  });
});
