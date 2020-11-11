// @flow

import path from 'path';

import getMikoOptions, { type mikoOptionsType } from '../getMikoOptions';
import cache from '../cache';

const command =
  'yarn install && lerna exec \'echo "test" && echo "test test"\' --stream && echo "test test \'"test"test\'test" && echo "test"';
const expectedCommand = [
  ['yarn', 'install'],
  ['lerna', 'exec', '\'echo "test" && echo "test test"\'', '--stream'],
  ['echo', '"test test \'"test"test\'test"'],
  ['echo', '"test"'],
];

describe('get miko options', () => {
  beforeAll(() => {
    cache.load({
      filepath: path.resolve('.mikorc.js'),
      config: [
        {
          /**
           * @return {object} - miko config object
           */
          miko: () => ({
            cmdString: {
              command,
              description: 'cmd string',
            },
            cmdFunc: {
              /**
               * @return {string} - command string
               */
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
    argv                      | expected
    ${['generate']}           | ${{ type: 'generate', keep: false }}
    ${['generate', '--keep']} | ${{ type: 'generate', keep: true }}
    ${['kill']}               | ${{ type: 'kill' }}
    ${['cmdString']}          | ${{ type: 'command', command: expectedCommand }}
    ${['cmdFunc']}            | ${{ type: 'command', command: expectedCommand }}
    ${['cmdFunc', '-a']}      | ${{ type: 'command', command: [...expectedCommand.slice(0, -1), [...expectedCommand.slice(-1)[0], '-a']] }}
    ${['mergeCmd']}           | ${{ type: 'command', command: [...expectedCommand.slice(0, -1), [...expectedCommand.slice(-1)[0], '-a']] }}
    ${['mergeEnv']}           | ${{ type: 'command', command: [['NODE_ENV=production', ...expectedCommand[0]], ...expectedCommand.slice(1)] }}
    ${['mergeLerna']}         | ${{ type: 'command', command: [['lerna', 'exec', `"echo 'test' && echo 'test test' && ${command} && ${command} -a"`, '--stream']] }}
  `(
    'run $argv',
    async ({
      argv,
      expected,
    }: {|
      argv: $ReadOnlyArray<string>,
      expected: mikoOptionsType,
    |}) => {
      const { getCommands, ...mikoOptions } = await getMikoOptions([
        'node',
        'miko',
        ...argv,
      ]);

      expect({ ...mikoOptions, command: getCommands?.() }).toEqual(expected);
    },
  );
});
