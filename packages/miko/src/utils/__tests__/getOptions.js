// @flow

import path from 'path';

import getOptions, { type optionsType } from '../getOptions';
import cache from '../cache';

const command =
  'yarn install && lerna exec \'echo "test" && echo "test test"\' --stream && echo "test" && echo "test test"';
const expectedCommand = [
  ['yarn', 'install'],
  ['lerna', 'exec', '\'echo "test" && echo "test test"\'', '--stream'],
  ['echo', '"test"'],
  ['echo', '"test test"'],
];

describe('get options', () => {
  beforeAll(() => {
    cache.load({
      filepath: path.resolve('.mikorc.js'),
      config: [
        {
          miko: () => ({
            cmdString: {
              command,
              description: 'cmd string',
            },
            cmdFunc: {
              command: () => command,
              description: 'cmd func',
            },
            mergeCmd: {
              command: 'miko cmdString -a',
              description: 'merge cmd',
            },
            mergeEnv: {
              command: 'NODE_ENV=production miko cmdString',
              description: 'merge env',
            },
            mergeLerna: {
              command:
                "lerna exec \"echo 'test' && echo 'test test' && miko cmdString && miko mergeCmd\" --stream",
              description: 'merge lerna',
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
    ${['cmdString']}               | ${{ type: 'command', command: expectedCommand }}
    ${['cmdFunc']}                 | ${{ type: 'command', command: expectedCommand }}
    ${['cmdFunc', '-a']}           | ${{ type: 'command', command: [...expectedCommand.slice(0, -1), [...expectedCommand.slice(-1)[0], '-a']] }}
    ${['mergeCmd']}                | ${{ type: 'command', command: [...expectedCommand.slice(0, -1), [...expectedCommand.slice(-1)[0], '-a']] }}
    ${['mergeEnv']}                | ${{ type: 'command', command: [['NODE_ENV=production', ...expectedCommand[0]], ...expectedCommand.slice(1)] }}
    ${['mergeLerna']}              | ${{ type: 'command', command: [['lerna', 'exec', `"echo 'test' && echo 'test test' && ${command} && ${command} -a"`, '--stream']] }}
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
