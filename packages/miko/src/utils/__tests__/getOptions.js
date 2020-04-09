// @flow

import path from 'path';

import getOptions, { type optionsType } from '../getOptions';
import cache from '../cache';

describe('get options', () => {
  beforeAll(() => {
    cache.load({
      filepath: path.resolve('.mikorc.js'),
      config: [
        {
          miko: () => ({
            install: {
              command: 'yarn install && yarn lerna bootstrap',
              description: 'install the packages in the monorepo',
            },
          }),
        },
      ],
    });
  });

  test.each`
    argv                           | expected
    ${[]}                          | ${{ type: 'start', configNames: [], keep: false }}
    ${['babel']}                   | ${{ type: 'start', configNames: ['babel'], keep: false }}
    ${['babel', 'lint']}           | ${{ type: 'start', configNames: ['babel', 'lint'], keep: false }}
    ${['--keep']}                  | ${{ type: 'start', configNames: [], keep: true }}
    ${['--keep', 'babel']}         | ${{ type: 'start', configNames: ['babel'], keep: true }}
    ${['--keep', 'babel', 'lint']} | ${{ type: 'start', configNames: ['babel', 'lint'], keep: true }}
    ${['kill']}                    | ${{ type: 'kill' }}
    ${['install']}                 | ${{ type: 'command', command: 'yarn install && yarn lerna bootstrap' }}
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
