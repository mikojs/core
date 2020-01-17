// @flow

import getExecCommands from '../getExecCommands';

import testings from './__ignore__/testings';

describe('get exec commands', () => {
  test.each(testings)(
    'run command = %s with %j',
    (command: string, config: {}) => {
      expect(getExecCommands(command.split(/:/), config)).toEqual(['cmd']);
    },
  );

  test('not exist', () => {
    expect(getExecCommands(['not', 'exist'], {})).toBeNull();
  });
});
