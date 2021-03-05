// @flow

import getCommands from '../getCommands';

import testings, { type testingType } from './__ignore__/testings';

describe('get commands', () => {
  test.each(testings)(
    'get commands from %s',
    (
      command: $ElementType<testingType, 0>,
      expected: $ElementType<testingType, 1>,
    ) => {
      expect(getCommands(command)).toEqual(expected);
    },
  );
});
