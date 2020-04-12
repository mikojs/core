// @flow

import getExecaArguments from '../getExecaArguments';
import { type commandsType } from '../getCommands';

describe('get execa arguments', () => {
  test.each`
    commands                                   | env                           | expected
    ${['NODE_ENV=production', 'echo', 'test']} | ${{ NODE_ENV: 'production' }} | ${['echo', ['test']]}
    ${['echo', 'test', 'NODE_ENV=production']} | ${{}}                         | ${['echo', ['test', 'NODE_ENV=production']]}
  `(
    'run $commands',
    ({
      commands,
      env,
      expected,
    }: {|
      commands: $ElementType<commandsType, number>,
      env: { [string]: string },
      expected: [string, $ElementType<commandsType, number>],
    |}) => {
      expect(getExecaArguments(commands)).toEqual([
        ...expected,
        {
          stdio: 'inherit',
          env,
        },
      ]);
    },
  );
});
