// @flow

import getOptions, { type optionsType } from '../getOptions';

describe('get options', () => {
  test.each`
    argv                          | expected
    ${[]}                         | ${{ type: 'start', configNames: [] }}
    ${['babel']}                  | ${{ type: 'start', configNames: ['babel'] }}
    ${['babel', 'lint']}          | ${{ type: 'start', configNames: ['babel', 'lint'] }}
    ${['watch']}                  | ${{ type: 'watch', configNames: [] }}
    ${['watch', 'babel']}         | ${{ type: 'watch', configNames: ['babel'] }}
    ${['watch', 'babel', 'lint']} | ${{ type: 'watch', configNames: ['babel', 'lint'] }}
    ${['kill']}                   | ${{ type: 'kill' }}
    ${['init']}                   | ${{ type: 'init' }}
  `(
    'run $argv',
    async ({
      argv,
      expected,
    }: {|
      argv: $ReadOnlyArray<string>,
      expected: optionsType,
    |}) => {
      const mockLog = jest.fn();

      global.console.error = mockLog;

      expect(await getOptions(['node', 'miko', ...argv])).toEqual(expected);
      (!expected ? expect(mockLog) : expect(mockLog).not).toHaveBeenCalled();
    },
  );
});
