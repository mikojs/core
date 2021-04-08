import commander from '@mikojs/commander';

import transform from '../transform';
import run from '../run';

jest.mock('../run', () => jest.fn());

describe('transform', () => {
  beforeEach(() => {
    run.mockClear();
  });

  test.each`
    argv                    | expected
    ${['custom']}           | ${['custom']}
    ${['custom', '-o']}     | ${['custom', '-o']}
    ${['func', '-a']}       | ${['custom', '-a']}
    ${['func', '-o', '-a']} | ${['custom', 'option', '-a']}
    ${['str', '-a']}        | ${['custom', '-a']}
  `('argv = $argv', async ({ argv, expected }) => {
    await commander(
      transform({
        name: 'name',
        version: '1.0.0',
        description: 'description',
        arguments: '<args...>',
        exitOverride: true,
        commands: {
          func: {
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
          str: {
            description: 'description',
            action: 'custom',
          },
        },
      }),
    ).parseAsync(['node', 'miko', ...argv]);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expected);
  });
});
