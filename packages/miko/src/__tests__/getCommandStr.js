import stringArgv from 'string-argv';

import getCommandStr from '../getCommandStr';

describe('get command str', () => {
  test.each`
    argv
    ${['command', 'command']}
    ${['command', 'command command']}
    ${['command', 'command "command command"']}
    ${['command', "command 'command command'"]}
  `('argv = $argv', ({ argv, expected }) => {
    expect(stringArgv(getCommandStr(argv))).toEqual(argv);
  });
});
