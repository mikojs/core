// @flow

import findFlowDir from '../findFlowDir';

describe('find flow dir', () => {
  test.each`
    cwd          | expected
    ${undefined} | ${14}
    ${__dirname} | ${2}
  `(
    'find flow dir with cwd = $cwd',
    ({ cwd, expected }: {| cwd?: string, expected: number |}) => {
      const mockLog = jest.fn();

      global.console.warn = mockLog;

      expect(findFlowDir(cwd)).toHaveLength(expected);
      (!cwd ? expect(mockLog) : expect(mockLog).not).toHaveBeenCalled();
    },
  );
});
