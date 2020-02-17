// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import cliOptions from '../index';

import configs from 'utils/configs';

describe('cli options', () => {
  beforeAll(() => {
    configs.loadConfig({
      config: {
        cli: emptyFunction,
      },
      filepath: path.resolve(process.cwd(), './.catrc.js'),
    });
  });

  test.each`
    argv                       | expected | consoleName
    ${[]}                      | ${false} | ${'error'}
    ${['notFound']}            | ${false} | ${'error'}
    ${['cli']}                 | ${true}  | ${undefined}
    ${['info']}                | ${true}  | ${'info'}
    ${['install', 'notFound']} | ${false} | ${'error'}
    ${['install', 'cli']}      | ${true}  | ${undefined}
    ${['remove', 'notFound']}  | ${false} | ${'error'}
    ${['remove', 'cli']}       | ${true}  | ${undefined}
  `(
    'run $argv',
    async ({
      argv,
      expected,
      consoleName,
    }: {|
      argv: $ReadOnlyArray<string>,
      expected: boolean,
      consoleName: ?string,
    |}) => {
      const mockLog = jest.fn();

      if (consoleName) global.console[consoleName] = mockLog;

      const result = await cliOptions(['node', 'configs', ...argv]);

      if (expected) expect(result).toBeDefined();
      else expect(result).toBe(expected);

      if (consoleName) expect(mockLog).toHaveBeenCalled();
    },
  );

  test('run command with --configs-files', async () => {
    const prevConfigsFiles = { ...configs.get('babel').configsFiles };

    await cliOptions(['node', 'configs', 'babel', '--configs-files', 'lint']);

    expect(prevConfigsFiles).toEqual(
      expect.not.objectContaining({ lint: true }),
    );
    expect(configs.get('babel').configsFiles).toEqual(
      expect.objectContaining({ lint: true }),
    );
  });
});
