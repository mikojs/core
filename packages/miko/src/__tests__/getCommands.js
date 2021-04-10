import commander from '@mikojs/commander';

import getCommands from '../getCommands';

const parseArgv = argv =>
  new Promise(resolve => {
    commander({
      name: 'name',
      description: 'description',
      exitOverride: true,
      commands: {
        command: {
          description: 'description',
          action: () => resolve('command'),
        },
      },
    }).parse(argv);
  });

describe('get commands', () => {
  test.each`
    commandStr                                       | expected
    ${'miko command'}                                | ${[['command']]}
    ${'miko command && miko command'}                | ${[['command'], ['command']]}
    ${'miko command "miko command"'}                 | ${[['command', 'command']]}
    ${'miko command "miko command && miko command"'} | ${[['command', 'command && command']]}
  `('$commandStr', async ({ commandStr, expected }) => {
    expect(await getCommands(commandStr, parseArgv)).toEqual(expected);
  });
});
