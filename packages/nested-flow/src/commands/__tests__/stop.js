// @flow

import execa from 'execa';

import stop from '../stop';

describe('stop', () => {
  beforeEach(() => {
    execa.mockClear();
  });

  test.each`
    hasError
    ${false}
    ${true}
  `(
    'run command with error = $hasError',
    async ({ hasError }: {| hasError: boolean |}) => {
      const mockLog = jest.fn();

      global.console.log = mockLog;

      if (hasError)
        execa.mockImplementation(() => Promise.reject(new Error('error')));

      const endFunc = await stop(['flow', 'stop'], __dirname);

      expect(endFunc()).toBe(hasError);
      expect(mockLog).toHaveBeenCalled();
    },
  );
});
