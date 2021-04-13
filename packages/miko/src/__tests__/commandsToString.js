import commandsToString from '../commandsToString';

describe('commands to string', () => {
  test.each`
    commands                      | expected
    ${[['command'], ['command']]} | ${'command && command'}
    ${[['"command command"']]}    | ${'"command command"'}
    ${[["'command command'"]]}    | ${"'command command'"}
  `('get $commands string', ({ commands, expected }) => {
    expect(commandsToString(commands)).toBe(expected);
  });
});
