import { generateCli, mockStdout } from '@mikojs/yarn-plugin-utils/src/testing';

const args = ['miko-todo', 'arg'];

describe('miko', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('does not have any config', async () => {
    const { cosmiconfigSync } = require('cosmiconfig');

    cosmiconfigSync.mockReturnValue({
      search: jest.fn().mockReturnValue({
        config: null,
      }),
    });

    const { commands } = require('..');
    const cli = generateCli(commands);

    await cli.run(args);

    expect(mockStdout.write).toHaveBeenCalledTimes(1);
    expect(mockStdout.write).toHaveBeenCalledWith(
      expect.stringMatching('Command not found'),
    );
  });
});
