import getCommands from '../getCommands';

describe('get commands', () => {
  test.each`
    commandStr                                       | expected
    ${'miko command'}                                | ${[['command']]}
    ${'miko command && miko command'}                | ${[['command'], ['command']]}
    ${'miko command "miko command"'}                 | ${[['command', 'command']]}
    ${'miko command "miko command && miko command"'} | ${[['command', 'command && command']]}
  `('$commandStr', ({ commandStr, expected }) => {
    expect(getCommands(commandStr, () => 'command')).toEqual(expected);
  });
});
