// @flow

import path from 'path';

import { outputFileSync } from 'output-file-sync';
import { inquirer } from 'inquirer';
// $FlowFixMe jest mock
import { execa } from 'execa';

import Store from '../index';

/** example store */
class Example extends Store {}

const example = new Example();
const filePath = path.resolve(__dirname, './__ignore__/file.txt');
const content = `test;
added;`;

describe('store', () => {
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
      outputFileSync.destPaths = [];
      outputFileSync.contents = [];
      inquirer.result = inquirerResult;

      await example.conflictFile(filePath, content);

      if (inquirerResult.action === 'diff') {
        expect(mockLog).toHaveBeenCalledWith(' test;\n');
        expect(mockLog).toHaveBeenCalledWith('{red -removed;\n}');
        expect(mockLog).toHaveBeenCalledWith('{green +added;}');
      } else expect(mockLog).not.toHaveBeenCalled();

      expect(outputFileSync.destPaths).toHaveLength(length);
      expect(outputFileSync.contents).toHaveLength(length);
    },
  );

  test('store with --skip-command', async () => {
    execa.cmds = [];
    example.ctx = {
      projectDir: 'project dir',
      skipCommand: true,
      lerna: false,
    };

    await example.execa('command skip');

    expect(execa.cmds).toHaveLength(0);
  });

  test('store with execa error', async () => {
    const mockLog = jest.fn();

    global.console.info = mockLog;
    example.ctx = {
      projectDir: 'project dir',
      skipCommand: false,
      lerna: false,
    };
    execa.mainFunction = () => {
      throw new Error('command error');
    };

    await expect(example.execa('command error')).rejects.toThrow(
      'Run command: `command error` fail',
    );
    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(
      '{blue ℹ }{blue {bold @mikojs/create-project}} Run command: {green command error}',
    );
  });
});
