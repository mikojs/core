// @flow

import path from 'path';

import cliOptions from '../cliOptions';

const defaultArgv = ['node', 'lerna-create'];

describe('cli options', () => {
  it('work', () => {
    expect(cliOptions([...defaultArgv, 'new-project'])).toEqual({
      newProject: path.resolve('new-project'),
    });
  });

  it('fail', () => {
    expect(() => {
      cliOptions(defaultArgv);
    }).toThrow('process exit');
  });
});
