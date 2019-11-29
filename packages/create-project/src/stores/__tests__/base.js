// @flow

import execa from 'execa';
import chalk from 'chalk';

import { version } from '../../../package.json';

import base from '../base';

const NOT_FOUND_GIT_ERROR =
  'fatal: not a git repository (or any of the parent directories): .git';
const DEFAULT_GIT_COMMANDS = [
  'yarn flow-typed install',
  'git init',
  'git add .',
  'node ./node_modules/husky/husky.js install',
  `git commit -m "chore(root): project init, create-project: v${version}"`,
];

describe('base', () => {
  beforeEach(() => {
    execa.mockClear();
  });

  test.each`
    ctx                                      | stderr                 | expected
    ${{}}                                    | ${'error'}             | ${['yarn flow-typed install']}
    ${{}}                                    | ${NOT_FOUND_GIT_ERROR} | ${DEFAULT_GIT_COMMANDS}
    ${{ pkg: { repository: 'repository' } }} | ${NOT_FOUND_GIT_ERROR} | ${[...DEFAULT_GIT_COMMANDS, 'git remote add origin repository']}
  `(
    'run git init commands with $stderr',
    async ({
      ctx,
      stderr,
      expected,
    }: {|
      ctx: {| [string]: string |},
      stderr: string,
      expected: $ReadOnlyArray<string>,
    |}) => {
      const mockLog = jest.fn();
      const error = new Error('error');

      global.console.info = mockLog;
      base.ctx = {
        ...ctx,
        projectDir: 'project dir',
        skipCommand: false,
        verbose: true,
      };
      // TODO: flow not support
      // eslint-disable-next-line flowtype/no-weak-types
      (error: any).stderr = stderr;
      execa.mockResolvedValueOnce().mockRejectedValueOnce(error);

      expect(
        await base.end({
          ...ctx,
          projectDir: 'project dir',
          verbose: true,
        }),
      ).toBeUndefined();

      const cmds = execa.mock.calls
        .map(([cmd, argu]: [string, $ReadOnlyArray<string>]) =>
          [cmd, ...argu].join(' '),
        )
        .filter((cmd: string) => cmd !== 'git status');

      expect(cmds).toEqual(expected);
      expect(mockLog).toHaveBeenCalledTimes(execa.mock.calls.length - 1);

      cmds.forEach((cmd: string) => {
        expect(mockLog).toHaveBeenCalledWith(
          chalk`{blue ℹ }{blue {bold @mikojs/create-project}} Run command: {green ${cmd}}`,
        );
      });
    },
  );
});
