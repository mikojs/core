// @flow

import cliOptions from '../cliOptions';

const defaultArgv = ['node', 'badges'];

describe('cli options', () => {
  test('work', () => {
    expect(cliOptions([...defaultArgv, 'readme-path'])).toEqual([
      'readme-path',
    ]);
  });

  test('not give readme path', () => {
    const mockLog = jest.fn();

    global.console.error = mockLog;

    expect(cliOptions(defaultArgv)).toEqual([]);
    expect(mockLog).toHaveBeenCalled();
  });
});
