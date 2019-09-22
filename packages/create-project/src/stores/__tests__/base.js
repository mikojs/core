// @flow

// $FlowFixMe jest mock
import { execa } from 'execa';
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

      global.console.info = mockLog;
      base.ctx = { ...ctx, projectDir: 'project dir', skipCommand: false };
      execa.cmds = [];
      execa.mainFunction = (cmd: string) => {
        if (cmd !== 'git status') return;

        const error = new Error('error');

        // eslint-disable-next-line flowtype/no-weak-types
        (error: any).stderr = stderr;
        throw error;
      };

      expect(
        await base.end({
          ...ctx,
          projectDir: 'project dir',
        }),
      ).toBeUndefined();
      expect(execa.cmds).toEqual([...expected]);
      expect(mockLog).toHaveBeenCalledTimes(execa.cmds.length);

      execa.cmds.forEach((cmd: string) => {
        expect(mockLog).toHaveBeenCalledWith(
          chalk`{blue ℹ }{blue {bold @mikojs/create-project}} Run command: {green ${cmd}}`,
        );
      });
    },
  );
});
