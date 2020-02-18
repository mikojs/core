// @flow

import getCommands from '../getCommands';

import testings from './__ignore__/testings';

describe('get commands', () => {
  test.each(testings)(
    'run command = %s with %j',
    (command: string, config: {}) => {
      expect(getCommands(command.split(/:/), config)).toEqual(['cmd']);
    },
  );

  test('not exist', () => {
    expect(getCommands(['not', 'exist'], {})).toBeNull();
  });

  test('not find exec command', () => {
    expect(() => getCommands(['test'], { test: ['exec:error'] })).toThrow(
      'Can not find `exec:error` in the config',
    );
  });
});
