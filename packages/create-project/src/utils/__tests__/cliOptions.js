// @flow

import path from 'path';

import cliOptions from '../cliOptions';

const defaultArgv = ['node', 'create-project'];

describe('cli options', () => {
  test.each`
    argv         | cmd
    ${[]}        | ${'yarn'}
    ${['--npm']} | ${'npm'}
  `(
    'work with options = $argv',
    ({ argv, cmd }: { argv: $ReadOnlyArray<string>, cmd: string }) => {
      expect(cliOptions([...defaultArgv, 'projectDir', ...argv])).toEqual({
        projectDir: path.resolve('projectDir'),
        cmd,
      });
    },
  );

  test('no project directory', () => {
    expect(() => {
      cliOptions(defaultArgv);
    }).toThrow('process exit');
  });
});
