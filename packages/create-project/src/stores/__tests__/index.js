// @flow

import path from 'path';

import outputFileSync from 'output-file-sync';
import { inquirer } from 'inquirer';
// $FlowFixMe jest mock
import { execa } from 'execa';
import chalk from 'chalk';

import Store from '../index';

/** example store */
class Example extends Store {}

const example = new Example();
const filePath = path.resolve(__dirname, './__ignore__/file.txt');
const content = `test;
added;`;

describe('store', () => {
  beforeEach(() => {
    outputFileSync.mockReset();
  });

  test.each`
    inquirerResult                          | length
    ${{ action: 'skip', overwrite: false }} | ${0}
    ${{ action: 'diff', overwrite: false }} | ${0}
    ${{ action: 'diff', overwrite: true }}  | ${1}
  `(
    'conflict file with $inquirerResult',
    async ({
      inquirerResult,
      length,
    }: {|
      inquirerResult: {| action: 'skip' | 'diff', overwrite: boolean |},
      length: number,
    |}) => {
      const mockLog = jest.fn();

      global.console.log = mockLog;
      inquirer.result = inquirerResult;

      await example.conflictFile(filePath, content);

      if (inquirerResult.action === 'diff')
        expect(mockLog).toHaveBeenCalledWith(
          `test;
${chalk`{red removed;
}${chalk`{green added;}`}`}`,
        );
      else expect(mockLog).not.toHaveBeenCalled();

      expect(outputFileSync.mock.calls).toHaveLength(length);
    },
  );

  test('run command with --skip-command', async () => {
    execa.cmds = [];
    example.ctx = {
      projectDir: 'project dir',
      skipCommand: true,
      lerna: false,
      verbose: true,
    };

    await example.execa('command skip');

    expect(execa.cmds).toHaveLength(0);
  });

  test('run command with verbose = false', async () => {
    const mockLog = jest.fn();

    global.console.log = mockLog;
    example.ctx = {
      projectDir: 'project dir',
      skipCommand: false,
      lerna: false,
      verbose: false,
    };

    await example.execa('babel');

    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockLog).toHaveBeenCalledWith(
      chalk`{gray   }{gray {bold @mikojs/create-project}} Run command: {green babel}`,
    );
    expect(mockLog).toHaveBeenCalledWith(
      chalk`{green ✔ }{green {bold @mikojs/create-project}} Run command: {green babel}`,
    );
  });

  test.each`
    verbose
    ${true}
    ${false}
  `(
    'run command with execa error and verbose = $verbose',
    async ({ verbose }: {| verbose: boolean |}) => {
      const mockLog = jest.fn();

      global.console.info = mockLog;
      global.console.log = mockLog;
      global.console.error = mockLog;
      example.ctx = {
        projectDir: 'project dir',
        skipCommand: false,
        lerna: false,
        verbose,
      };
      execa.mainFunction = () => {
        throw new Error('command error');
      };

      await expect(example.execa('command error')).rejects.toThrow(
        'Run command: `command error` fail',
      );

      if (verbose) {
        expect(mockLog).toHaveBeenCalledTimes(1);
        expect(mockLog).toHaveBeenCalledWith(
          chalk`{blue ℹ }{blue {bold @mikojs/create-project}} Run command: {green command error}`,
        );
      } else {
        expect(mockLog).toHaveBeenCalledTimes(2);
        expect(mockLog).toHaveBeenCalledWith(
          chalk`{gray   }{gray {bold @mikojs/create-project}} Run command: {green command error}`,
        );
        expect(mockLog).toHaveBeenCalledWith(
          chalk`{red ✖ }{red {bold @mikojs/create-project}} Run command: {green command error}`,
        );
      }
    },
  );
});
