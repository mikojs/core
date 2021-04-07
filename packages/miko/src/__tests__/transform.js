import commander from '@mikojs/commander';

import transform from '../transform';
import run from '../run';

const defaultConfig = {
  description: 'description',
  options: [
    {
      flags: '-o',
      description: 'description',
    },
  ],
};

jest.mock('../run', () => jest.fn());

describe('transform', () => {
  beforeEach(() => {
    run.mockClear();
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

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(...expected);
  });
});
