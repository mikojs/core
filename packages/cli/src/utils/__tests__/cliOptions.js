// @flow

import cliOptions, { resolveAction } from '../cliOptions';

import mockCli from './__ignore__/cli';

const defaultArgv = ['node', 'cli'];

describe('cli options', () => {
  test.each`
    command
    ${[]}
    ${['not-find-command']}
  `(
    'throw error with $command',
    async ({ command }: { command: $ReadOnlyArray<string> }): Promise<void> => {
      await expect(cliOptions([...defaultArgv, ...command])).rejects.toThrow(
        'process exit',
      );
    },
  );

  describe('resolve action', () => {
    it('work', async (): Promise<void> => {
      const mockResolve = jest.fn();
      const args = ['args'];

      await resolveAction('../utils/__tests__/__ignore__/cli', mockResolve)(
        ...args,
      );

      expect(mockCli).toHaveBeenCalledTimes(1);
      expect(mockCli).toHaveBeenCalledWith(args);
      expect(mockResolve).toHaveBeenCalledTimes(1);
      expect(mockResolve).toHaveBeenCalledWith();
    });
  });
});
