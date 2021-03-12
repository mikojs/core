// @flow

import getCommands from '../getCommands';
import getParseArgv from '../getParseArgv';

import testings, { type testingType } from './__ignore__/testings';

const parseArgv = getParseArgv({
  miko: {
    description: 'description',
    command: 'command',
    commands: {
      miko: {
        description: 'description',
        command: 'command && command',
      },
    },
  },
});

describe('get commands', () => {
  test.each(testings)(
    'get commands from `%s`',
    async (
      commandStr: $ElementType<testingType, 0>,
      expected: $ElementType<testingType, 1>,
    ) => {
      expect(await getCommands(commandStr, parseArgv)).toEqual(expected);
    },
  );
});
