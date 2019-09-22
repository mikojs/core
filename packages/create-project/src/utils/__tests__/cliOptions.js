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
    const mockLog = jest.fn();

    global.console.error = mockLog;

    expect(cliOptions(defaultArgv)).toBeNull();
    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(
      '{red ✖ }{red {bold @mikojs/create-project}} {red `project directory`} is required',
    );
  });
});
