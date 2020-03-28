// @flow

import getOptions from '../getOptions';

const defaultArgv = ['node', 'badges'];

describe('get options', () => {
  test.each`
    argv
    ${['readmePath']}
    ${['readmePath1', 'readmePath2']}
  `('run with $argv', async ({ argv }: {| argv: $ReadOnlyArray<string> |}) => {
    expect(await getOptions([...defaultArgv, ...argv])).toEqual(argv);
  });

  test('not give readme path', async () => {
    const mockLog = jest.fn();

    global.console.error = mockLog;

    expect(await getOptions(defaultArgv)).toEqual([]);
    expect(mockLog).toHaveBeenCalled();
  });
});
