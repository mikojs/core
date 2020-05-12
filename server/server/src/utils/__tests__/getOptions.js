// @flow

import getOptions, { type optionsType } from '../getOptions';

describe('get options', () => {
  test.each`
    argv                      | expected
    ${[]}                     | ${{ port: 8000, folderPath: './' }}
    ${['-p', '8080']}         | ${{ port: 8080, folderPath: './' }}
    ${['-f', './folderPath']} | ${{ port: 8000, folderPath: './folderPath' }}
  `(
    'run $argv',
    async ({
      argv,
      expected,
    }: {|
      argv: $ReadOnlyArray<string>,
      expected: optionsType,
    |}) => {
      expect(await getOptions(['node', 'server', ...argv])).toEqual(expected);
    },
  );
});
