// @flow

import npmWhich from 'npm-which';
import { cosmiconfigSync } from 'cosmiconfig';

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
    ${['ls']}         | ${[npmWhich(process.cwd()).sync('ls')]}
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

  test('empty config', async () => {
    cosmiconfigSync.mockReturnValue({
      search: jest.fn().mockReturnValue(undefined),
    });

    await expect(cliOptions(['node', 'configs-exec', 'foo'])).rejects.toThrow(
      'not found: foo',
    );
  });
});
