// @flow

import getCommand from '../getCommand';

jest.mock('execa', (): ((
  filename: string,
  argv: $ReadOnlyArray<string>,
  options: {},
) => Promise<mixed>) => {
  const execa = jest.requireActual('execa');
  const path = jest.requireActual('path');

  return (filename: string, argv: $ReadOnlyArray<string>, options: {}) =>
    execa(filename, argv, {
      ...options,
      cwd: path.resolve('./packages/miko/src/utils/__tests__/__ignore__'),
    });
});

describe('get command', () => {
  test.each`
    commands                                                             | expected
    ${['babel src -d lib']}                                              | ${['babel', 'src', '-d', 'lib']}
    ${['lerna exec "ls"']}                                               | ${['lerna', 'exec', '"ls"']}
    ${['lerna exec "ls $1"', 'echo "-al"']}                              | ${['lerna', 'exec', '"ls -al"']}
    ${['lerna exec "ls $1"', "echo '-al'"]}                              | ${['lerna', 'exec', '"ls -al"']}
    ${['lerna exec "ls $1"', 'yarn test']}                               | ${['lerna', 'exec', '"ls -al"']}
    ${['lerna exec "ls $1"', 'yarn temp']}                               | ${['lerna', 'exec', '"ls -al"']}
    ${['lerna exec "ls $1 $2"', '', 'miko run "echo "$1"" "yarn temp"']} | ${['lerna', 'exec', '"ls  -al"']}
  `(
    'run $commands',
    async ({
      commands,
      expected,
    }: {|
      commands: $ReadOnlyArray<string>,
      expected: $ReadOnlyArray<string>,
    |}) => {
      expect(await getCommand(commands)).toEqual(expected);
    },
  );
});
