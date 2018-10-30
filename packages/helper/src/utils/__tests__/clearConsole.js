// @flow

import clearConsole from '../clearConsole';

jest.mock('readline');

test('clear console', () => {
  const mockLog = jest.fn();

  global.console.log = mockLog;
  clearConsole();

  expect(mockLog).toHaveBeenCalledTimes(1);
  expect(mockLog.mock.calls[0][0].replace(/\n/g, '')).toBe('');
});
