// @flow

import getBadgesOptions from '../getBadgesOptions';

const defaultArgv = ['node', 'badges'];

describe('get badges options', () => {
  test.each`
    argv
    ${['readmePath']}
    ${['readmePath1', 'readmePath2']}
  `('run with $argv', async ({ argv }: {| argv: $ReadOnlyArray<string> |}) => {
    expect(await getBadgesOptions([...defaultArgv, ...argv])).toEqual(argv);
  });

  test('not give readme path', async () => {
    const mockLog = jest.fn();

    global.console.error = mockLog;

    expect(await getBadgesOptions(defaultArgv)).toEqual([]);
    expect(mockLog).toHaveBeenCalled();
  });
});
