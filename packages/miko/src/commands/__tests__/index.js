// @flow

import commands from '../index';
import { type commandsType } from '../normalize';

const command =
  'yarn install && lerna exec \'echo "test" && echo "test test"\' --stream && echo "test test \'"test"test\'test" && echo "test"';
const expectedCommand = [
  ['yarn', 'install'],
  ['lerna', 'exec', '\'echo "test" && echo "test test"\'', '--stream'],
  ['echo', '"test test \'"test"test\'test"'],
  ['echo', '"test"'],
];
const configs = {
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
};

describe('commands', () => {
  test.each`
    key                          | args      | expected
    ${[['customCommand', '-a']]} | ${[]}     | ${[['customCommand', '-a']]}
    ${'cmdString'}               | ${[]}     | ${expectedCommand}
    ${'cmdFunc'}                 | ${[]}     | ${expectedCommand}
    ${'cmdFunc'}                 | ${['-a']} | ${[...expectedCommand.slice(0, -1), [...expectedCommand.slice(-1)[0], '-a']]}
    ${'mergeCmd'}                | ${[]}     | ${[...expectedCommand.slice(0, -1), [...expectedCommand.slice(-1)[0], '-a']]}
    ${'mergeEnv'}                | ${[]}     | ${[['NODE_ENV=production', ...expectedCommand[0]], ...expectedCommand.slice(1)]}
    ${'mergeLerna'}              | ${[]}     | ${[['lerna', 'exec', `"echo 'test' && echo 'test test' && ${command} && ${command} -a"`, '--stream']]}
  `(
    'get command from $key',
    async ({
      key,
      args,
      expected,
    }: {|
      key: string | commandsType,
      args: $ReadOnlyArray<string>,
      expected: commandsType,
    |}) => {
      const { info, run } = await commands(configs, key, args);

      expect(await run()).toBeUndefined();
      expect(info).toEqual(
        expected
          .map((str: $ReadOnlyArray<string>) => str.join(' '))
          .join(' && '),
      );
    },
  );
});
