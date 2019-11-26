// @flow

import findFlowConfigs from '../findFlowConfigs';

describe('find flow configs', () => {
  test.each`
    cwd          | expected
    ${undefined} | ${13}
    ${__dirname} | ${1}
  `(
    'find flow configs with cwd = $cwd',
    ({ cwd, expected }: {| cwd?: string, expected: number |}) => {
      const mockLog = jest.fn();

      global.console.warn = mockLog;

      expect(findFlowConfigs(cwd)).toHaveLength(expected);
      (!cwd ? expect(mockLog) : expect(mockLog).not).toHaveBeenCalled();
    },
  );
});
