// @flow

import path from 'path';

import { npmWhich } from 'npm-which';
import { emptyFunction } from 'fbjs';
import chalk from 'chalk';

import cliOptions from '../cliOptions';
import configs from '../configs';

const defaultArgv = ['node', 'configs'];
const babelCli = npmWhich.main().sync('babel');

describe('cli options', () => {
  beforeAll(() => {
    configs.handleCustomConfigs({
      config: {
        notFoundCommand: {},
        runError: {
          alias: 'babel',
          run: () => {
            throw new Error('run error');
          },
        },
        runCmd: {
          alias: 'babel',
          install: emptyFunction.thatReturnsArgument,
          config: emptyFunction.thatReturnsArgument,
          run: emptyFunction.thatReturnsArgument,
        },
      },
      filepath: path.resolve(process.cwd(), './.catrc.js'),
    });
  });

  test('run command fail when command is not found', () => {
    const mockLog = jest.fn();

    npmWhich.throwError = true;
    global.console.error = mockLog;

    expect(cliOptions([...defaultArgv, 'notFoundCommand'])).toBeFalsy();
    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(
      chalk`{red ✖ }{red {bold @mikojs/configs}} Not found cli: notFoundCommand`,
    );

    npmWhich.throwError = false;
  });

  test('run command fail when running command throw error', () => {
    expect(() => {
      cliOptions([...defaultArgv, 'runError']);
    }).toThrow('run error');
  });

  test('run command with --configs-env', () => {
    expect(
      cliOptions([
        ...defaultArgv,
        'runCmd',
        '--optionA',
        '--configs-env',
        'react',
        '--optionB',
      ]),
    ).toEqual({
      cli: babelCli,
      argv: ['--optionA', '--optionB'],
      env: {},
      cliName: 'runCmd',
    });
    expect(configs.configsEnv).toEqual(['react']);
  });

  test.each`
    cliName     | argv
    ${'runCmd'} | ${[]}
    ${'babel'}  | ${['src', '-d', 'lib', '--verbose']}
  `(
    'run command with --configs-files',
    ({
      cliName,
      argv,
    }: {|
      cliName: string,
      argv: $ReadOnlyArray<string>,
    |}) => {
      expect(
        cliOptions([
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
      expect(configs.store.runCmd.configFiles).toEqual({
        jest: true,
      });
    },
  );

  test.each`
    cliName     | options          | cli          | argv
    ${'runCmd'} | ${['--install']} | ${'install'} | ${['yarn', 'add', '--dev']}
    ${'runCmd'} | ${['--remove']}  | ${'remove'}  | ${[]}
    ${'runCmd'} | ${[]}            | ${babelCli}  | ${[]}
  `(
    'Run $cliName successfully with $options',
    ({
      cliName,
      options,
      cli,
      argv,
    }: {|
      cliName: string,
      options: $ReadOnlyArray<string>,
      cli: string,
      argv: $ReadOnlyArray<string>,
    |}) => {
      expect(cliOptions([...defaultArgv, cliName, ...options])).toEqual({
        cli,
        argv,
        env: {},
        cliName,
      });
    },
  );

  test.each`
    argv                                   | expected | consoleName
    ${['--info']}                          | ${true}  | ${'info'}
    ${['runCmd', '--info']}                | ${true}  | ${'info'}
    ${['notFindCliName', '--info']}        | ${false} | ${'error'}
    ${[]}                                  | ${false} | ${'error'}
    ${['notFindCliName']}                  | ${false} | ${'error'}
    ${['runCmd', '--install', '--remove']} | ${false} | ${'error'}
  `(
    'Run $argv',
    ({
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

      expect(cliOptions([...defaultArgv, ...argv])).toBe(expected);
      expect(mockLog).toHaveBeenCalled();
    },
  );
});
