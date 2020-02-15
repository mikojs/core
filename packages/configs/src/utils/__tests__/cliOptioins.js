// @flow

import path from 'path';

import npmWhich from 'npm-which';
import { emptyFunction } from 'fbjs';
import chalk from 'chalk';

import cliOptions from '../cliOptions';
import configs from '../configs';

const defaultArgv = ['node', 'configs'];
const babelCli = npmWhich(process.cwd()).sync('babel');

describe('cli options', () => {
  beforeAll(() => {
    configs.loadConfig({
      config: {
        notFoundCommand: {},
        runError: {
          alias: 'babel',
          run: () => {
            throw new Error('run error');
          },
        },
        runCmd: {
          alias: () => babelCli,
          install: emptyFunction.thatReturnsArgument,
          config: emptyFunction.thatReturnsArgument,
          ignore: () => ({
            name: 'ignore',
          }),
          run: emptyFunction.thatReturnsArgument,
        },
      },
      filepath: path.resolve(process.cwd(), './.catrc.js'),
    });
  });

  test('run command fail when command is not found', async () => {
    const mockLog = jest.fn();

    global.console.error = mockLog;

    expect(await cliOptions([...defaultArgv, 'notFoundCommand'])).toBeFalsy();
    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(
      chalk`{red ✖ }{red {bold @mikojs/configs}} Not found cli: notFoundCommand`,
    );
  });

  test('run command fail when running command throw error', async () => {
    await expect(cliOptions([...defaultArgv, 'runError'])).rejects.toThrow(
      'run error',
    );
  });

  test.each`
    cliName     | argv
    ${'runCmd'} | ${[]}
    ${'babel'}  | ${['src', '-d', 'lib', '--verbose', '--config-file', '../../babel.config.js']}
  `(
    'run command with --configs-files',
    async ({
      cliName,
      argv,
    }: {|
      cliName: string,
      argv: $ReadOnlyArray<string>,
    |}) => {
      expect(
        await cliOptions([
          ...defaultArgv,
          cliName,
          '--optionA',
          '--configs-files=jest',
          '--optionB',
        ]),
      ).toEqual({
        cli: babelCli,
        argv: ['--optionA', '--optionB', ...argv],
        env: {},
        cliName,
      });
      expect(configs.get('runCmd').configsFiles).toEqual({
        jest: true,
      });
    },
  );

  test.each`
    cli          | cliName              | argv
    ${'install'} | ${'runCmd'}          | ${['yarn', 'add', '--dev']}
    ${'install'} | ${'notFoundCommand'} | ${['yarn', 'add', '--dev']}
    ${'remove'}  | ${'runCmd'}          | ${[]}
  `(
    'Run $cli',
    async ({
      cli,
      cliName,
      argv,
    }: {|
      cli: string,
      cliName: string,
      argv: $ReadOnlyArray<string>,
    |}) => {
      expect(await cliOptions([...defaultArgv, cli, cliName])).toEqual({
        cli,
        argv,
        env: {},
        cliName,
      });
    },
  );

  test.each`
    argv                             | expected | consoleName
    ${['info']}                      | ${true}  | ${'info'}
    ${['info', 'runCmd']}            | ${true}  | ${'info'}
    ${['info', 'notFindCliName']}    | ${false} | ${'error'}
    ${['install', 'notFindCliName']} | ${false} | ${'error'}
    ${['remove', 'notFindCliName']}  | ${false} | ${'error'}
    ${[]}                            | ${false} | ${'error'}
    ${['notFindCliName']}            | ${false} | ${'error'}
  `(
    'Run $argv',
    async ({
      argv,
      expected,
      consoleName,
    }: {|
      argv: $ReadOnlyArray<string>,
      expected: boolean,
      consoleName: string,
    |}) => {
      const mockLog = jest.fn();

      global.console[consoleName] = mockLog;

      expect(await cliOptions([...defaultArgv, ...argv])).toBe(expected);
      expect(mockLog).toHaveBeenCalled();
    },
  );
});
