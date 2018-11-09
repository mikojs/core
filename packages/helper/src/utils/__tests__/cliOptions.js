// @flow

import cliOptions from '../cliOptions';

const defaultArgv = ['node', 'helper'];
const args = 'babel src -d lib -w';

describe('cli options', () => {
  it(`Run '${args}'`, () => {
    expect(cliOptions([...defaultArgv, args])).toEqual({
      root: 'src',
      args,
    });
  });

  it(`Run '${args}' --production --root test`, () => {
    expect(cliOptions([...defaultArgv, args, '--root', 'test'])).toEqual({
      root: 'test',
      args,
    });
  });

  it('Run fail', () => {
    expect(() => {
      cliOptions(defaultArgv);
    }).toThrow('process exit');
  });
});
