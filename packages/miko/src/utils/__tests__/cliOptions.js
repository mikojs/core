// @flow

import cliOptions, { type optionsType } from '../cliOptions';

describe('cli options', () => {
  test.each`
    argv                        | expected
    ${[]}                       | ${false}
    ${['keyword']}              | ${{ keyword: 'keyword', filteredArgv: [] }}
    ${['keyword', '--options']} | ${{ keyword: 'keyword', filteredArgv: ['--options'] }}
  `(
    'run $argv',
    ({
      argv,
      expected,
    }: {|
      argv: $ReadOnlyArray<string>,
      expected: optionsType,
    |}) => {
      const mockLog = jest.fn();

      global.console.error = mockLog;

      expect(cliOptions(['node', 'miko', ...argv])).toEqual(expected);
      (!expected ? expect(mockLog) : expect(mockLog).not).toHaveBeenCalled();
    },
  );
});
