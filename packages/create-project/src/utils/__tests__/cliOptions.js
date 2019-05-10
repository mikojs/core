// @flow

import path from 'path';

import cliOptions from '../cliOptions';

const defaultArgv = ['node', 'create-project'];

describe('cli options', () => {
  test('work', () => {
    expect(cliOptions([...defaultArgv, 'projectDir'])).toEqual({
      projectDir: path.resolve('projectDir'),
      skipCommand: false,
      lerna: false,
    });
  });

  test('no project directory', () => {
    expect(() => {
      cliOptions(defaultArgv);
    }).toThrow('process exit');
  });
});
