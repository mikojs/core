import commander from '@mikojs/commander';

import transform from '../transform';
import run from '../run';

jest.mock('../run', () => jest.fn());

describe('transform', () => {
  beforeEach(() => {
    run.mockClear();
  });

  test.each`
    argv                       | expected
    ${['custom']}              | ${['custom']}
    ${['custom', '-o']}        | ${['custom', '-o']}
    ${['command', '-a']}       | ${['custom', '-a']}
    ${['command', '-o', '-a']} | ${['custom', 'option', '-a']}
  `('argv = $argv', async ({ argv, expected }) => {
    await commander(
      transform({
        name: 'name',
        version: '1.0.0',
        description: 'description',
        arguments: '<args...>',
        exitOverride: true,
        commands: {
          command: {
            description: 'description',
            arguments: '<args>',
            options: [
              {
                flags: '-o',
                description: 'description',
              },
            ],
            action: ({ o }) => (!o ? 'custom' : 'custom option'),
          },
        },
      }),
    ).parseAsync(['node', 'miko', ...argv]);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expected);
  });
});
