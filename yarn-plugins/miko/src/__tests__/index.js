import { generateCli } from '@mikojs/yarn-plugin-utils/src/testing';

import testings from './__ignore__/testings';

describe('miko', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test.each(testings)('%s', async (info, config, args, expecteds) => {
    const { cosmiconfigSync } = require('cosmiconfig');

    jest.mock('../utils/execRace', () => jest.fn().mockReturnValue(0));
    cosmiconfigSync.mockReturnValue({
      search: jest.fn().mockReturnValue({
        config,
      }),
    });

    const { commands } = require('..');
    const execRace = require('../utils/execRace');
    const cli = generateCli(commands);

    expect(await cli.run(args)).toBe(!expecteds ? 1 : 0);

    if (!expecteds) expect(execRace).not.toHaveBeenCalled();
    else {
      expect(execRace).toHaveBeenCalledTimes(expecteds.length);
      expecteds.forEach(expected => {
        expect(execRace).toHaveBeenCalledWith(
          expected,
          expect.objectContaining({ cwd: process.cwd() }),
          expect.any(Function),
          expect.any(Function),
        );
      });
    }
  });
});
