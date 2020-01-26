// @flow

import path from 'path';

import cliOptions from '../cliOptions';

describe('cli options', () => {
  test.each`
    argv                | expected
    ${['./projectDir']} | ${path.resolve('./projectDir')}
    ${[]}               | ${null}
  `(
    'Run $argv',
    async ({
      argv,
      expected,
    }: {|
      argv: $ReadOnlyArray<string>,
      expected: ?string,
    |}) => {
      const mockLog = jest.fn();

      global.console.error = mockLog;

      expect(await cliOptions(['node', 'create-project', ...argv])).toBe(
        expected,
      );
      (!expected ? expect(mockLog) : expect(mockLog).not).toHaveBeenCalled();
    },
  );
});
