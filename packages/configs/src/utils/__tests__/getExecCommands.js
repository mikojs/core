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

  test('not find exec command', () => {
    expect(() => getExecCommands(['test'], { test: ['exec:error'] })).toThrow(
      'Can not find `exec:error` in the config',
    );
  });
});
