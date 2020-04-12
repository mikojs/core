// @flow

import path from 'path';

import getOptions, { type optionsType } from '../getOptions';
import cache from '../cache';

const expectedCommand = [
  ['yarn', 'install'],
  ['lerna', 'bootstrap'],
];

describe('get options', () => {
  beforeAll(() => {
    cache.load({
      filepath: path.resolve('.mikorc.js'),
      config: [
        {
          miko: () => ({
            cmdString: {
              command: 'yarn install && lerna bootstrap',
              description: 'cmd string',
            },
            cmdFunc: {
              command: () => [
                ['yarn', 'install'],
                ['lerna', 'bootstrap'],
              ],
              description: 'cmd func',
            },
            mergeCmd: {
              command: 'miko cmdString -a',
              description: 'merge cmd',
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
    ${['cmdString']}               | ${{ type: 'command', otherArgs: [], command: expectedCommand }}
    ${['cmdFunc']}                 | ${{ type: 'command', otherArgs: [], command: expectedCommand }}
    ${['cmdFunc', '-a']}           | ${{ type: 'command', otherArgs: ['-a'], command: expectedCommand }}
    ${['mergeCmd']}                | ${{ type: 'command', otherArgs: [], command: [expectedCommand[0], [...expectedCommand[1], '-a']] }}
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

      const { getCommands, ...options } = await getOptions([
        'node',
        'miko',
        ...argv,
      ]);

      expect({ ...options, command: getCommands?.() }).toEqual(expected);
      (!expected ? expect(mockLog) : expect(mockLog).not).toHaveBeenCalled();
    },
  );
});
