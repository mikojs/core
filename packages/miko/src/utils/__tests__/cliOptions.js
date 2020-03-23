// @flow

import cliOptions, { type optionsType } from '../cliOptions';

describe('cli options', () => {
  test.each`
    argv                  | expected
    ${[]}                 | ${{ type: 'start', names: [] }}
    ${['babel']}          | ${{ type: 'start', names: ['babel'] }}
    ${['start']}          | ${{ type: 'start', names: [] }}
    ${['start', 'babel']} | ${{ type: 'start', names: ['babel'] }}
    ${['end']}            | ${{ type: 'end' }}
    ${['init']}           | ${{ type: 'init' }}
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

      expect(await cliOptions(['node', 'miko', ...argv])).toEqual(expected);
      (!expected ? expect(mockLog) : expect(mockLog).not).toHaveBeenCalled();
    },
  );
});
