// @flow

import cliOptions from '../cliOptions';

jest.mock('cosmiconfig', () => ({
  cosmiconfigSync: jest.fn().mockReturnValue({
    search: jest.fn().mockReturnValue({
      config: {
        test: ['test', 'foo'],
      },
    }),
  }),
}));

describe('cli options', () => {
  test.each`
    argv              | expected
    ${[]}             | ${false}
    ${['test']}       | ${['test', 'foo']}
    ${['test', '-a']} | ${['test', 'foo', '-a']}
    ${['info']}       | ${true}
  `(
    'run $argv',
    async ({
      argv,
      expected,
    }: {|
      argv: $ReadOnlyArray<string>,
      expected: boolean | $ReadOnlyArray<string>,
    |}) => {
      const mockLog = jest.fn();

      global.console.log = mockLog;
      global.console.info = mockLog;

      expect(await cliOptions(['node', 'configs-exec', ...argv])).toEqual(
        expected,
      );

      if (expected === true) expect(mockLog).toHaveBeenCalled();
    },
  );
});
