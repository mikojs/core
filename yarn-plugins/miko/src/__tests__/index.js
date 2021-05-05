import { generateCli } from '@mikojs/yarn-plugin-utils/src/testing';

import testings from './__ignore__/testings';

describe('miko', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test.each(testings)('%s', async (info, config, args, expected) => {
    const { cosmiconfigSync } = require('cosmiconfig');

    cosmiconfigSync.mockReturnValue({
      search: jest.fn().mockReturnValue({
        config,
      }),
    });

    const { commands } = require('..');
    const cli = generateCli(commands);

    await cli.run(args);
  });
});
