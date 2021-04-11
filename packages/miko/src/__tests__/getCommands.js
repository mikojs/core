import getCommands from '../getCommands';
import getParseArgv from '../getParseArgv';

const parseArgv = getParseArgv({
  exitOverride: true,
  commands: {
    command: {
      description: 'description',
      action: 'command',
    },
  },
});

describe('get commands', () => {
  test.each`
    commandStr                                             | expected
    ${['miko', 'command']}                                 | ${[['command']]}
    ${['miko', 'command', 'miko command']}                 | ${[['command', 'command']]}
    ${['miko', 'command', 'miko command && miko command']} | ${[['command', 'command && command']]}
  `('$commandStr', async ({ commandStr, expected }) => {
    expect(await getCommands(commandStr, parseArgv)).toEqual(expected);
  });
});
