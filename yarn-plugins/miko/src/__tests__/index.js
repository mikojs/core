import { generateCli, mockStdout } from '@mikojs/yarn-plugin-utils/src/testing';

import testings from './__ignore__/testings';

describe('miko', () => {
  beforeEach(() => {
    jest.resetModules();
    mockStdout.write.mockClear();
  });

  test.each(testings)('%s', async (info, config, expected) => {
    const { cosmiconfigSync } = require('cosmiconfig');

    cosmiconfigSync.mockReturnValue({
      search: jest.fn().mockReturnValue({
        config,
      }),
    });

    const { commands } = require('..');
    const cli = generateCli(commands);

    await cli.run(['miko-todo', 'miko']);

    expect(mockStdout.write).toHaveBeenCalledTimes(1);
    expect(mockStdout.write).toHaveBeenCalledWith(
      expect.stringMatching(
        `Command not found(.|\n)+While running ${expected}`,
      ),
    );
  });
});
