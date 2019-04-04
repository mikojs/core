// @flow

import path from 'path';

import cliOptions from '../cliOptions';

const defaultArgv = ['node', 'create-project'];

describe('cli options', () => {
  test('work', () => {
    expect(cliOptions([...defaultArgv, 'projectDir'])).toEqual({
      check: false,
      projectDir: path.resolve('projectDir'),
    });
  });

  test('no project directory', () => {
    expect(() => {
      cliOptions(defaultArgv);
    }).toThrow('process exit');
  });
});
