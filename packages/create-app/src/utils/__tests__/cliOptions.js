// @flow

import path from 'path';

import cliOptions from '../cliOptions';

const defaultArgv = ['node', 'configs-scripts'];
const projectDir = path.resolve('test');

describe('cli options', () => {
  test.each`
    options      | cmd
    ${[]}        | ${'yarn'}
    ${['--npm']} | ${'npm'}
  `(
    "Run command with options = '$options'",
    ({ options, cmd }: { options: $ReadOnlyArray<string>, cmd: string }) => {
      expect(cliOptions([...defaultArgv, 'test', ...options])).toEqual({
        projectDir,
        cmd,
      });
    },
  );

  it('Run fail', () => {
    expect(() => {
      cliOptions(defaultArgv);
    }).toThrow('process exit');
  });
});
