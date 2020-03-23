// @flow

import getOptions from '../getOptions';

const defaultArgv = ['node', 'badges'];

describe('get options', () => {
  test('work', () => {
    expect(getOptions([...defaultArgv, 'readme-path'])).toEqual([
      'readme-path',
    ]);
  });

  test('not give readme path', () => {
    const mockLog = jest.fn();

    global.console.error = mockLog;

    expect(getOptions(defaultArgv)).toEqual([]);
    expect(mockLog).toHaveBeenCalled();
  });
});
