import getCommands from '../getCommands';
import getParseArgv from '../getParseArgv';

const parseArgv = getParseArgv({
  exitOverride: true,
  commands: {
    command: {
      description: 'description',
      options: [
        {
          flags: '-e',
          description: 'description',
        },
      ],
      action: ({ e }) => (e ? 'NODE_ENV=production miko command' : 'command'),
    },
  },
});

describe('get commands', () => {
  test.each`
    commandStr                                             | expected
    ${['miko', 'command']}                                 | ${[['command']]}
    ${['miko', 'command', 'miko command']}                 | ${[['command', 'command']]}
    ${['miko', 'command', 'miko command && miko command']} | ${[['command', 'command && command']]}
    ${['test', 'test']}                                    | ${[['test', 'test']]}
    ${['NODE_ENV=production', 'miko', 'command']}          | ${[['NODE_ENV=production', 'command']]}
    ${['miko', 'command', '-e']}                           | ${[['NODE_ENV=production', 'command']]}
  `('$commandStr', async ({ commandStr, expected }) => {
    expect(await getCommands(commandStr, parseArgv)).toEqual(expected);
  });
});
