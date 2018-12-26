// @flow

import cliOptions from '../cliOptions';

const defaultArgv = ['node', 'badges'];

describe('cli options', () => {
  it('work', () => {
    expect(cliOptions([...defaultArgv, 'readme-path'])).toEqual([
      'readme-path',
    ]);
  });

  it('not give readme path', () => {
    expect(() => {
      cliOptions(defaultArgv);
    }).toThrow('process exit');
  });
});
