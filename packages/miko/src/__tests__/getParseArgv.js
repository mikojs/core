import getParseArgv from '../getParseArgv';

const parseArgv = getParseArgv({
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
});

describe('get parse argv', () => {
  test.each`
    argv                    | expected
    ${['custom']}           | ${['custom']}
    ${['custom', '-o']}     | ${['custom', '-o']}
    ${['func', '-a']}       | ${['custom', '-a']}
    ${['func', '-o', '-a']} | ${['custom', 'option', '-a']}
    ${['str', '-a']}        | ${['custom', '-a']}
  `('argv = $argv', async ({ argv, expected }) => {
    expect(await parseArgv(['node', 'miko', ...argv])).toEqual(expected);
  });
});
