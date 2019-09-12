// @flow

import path from 'path';

import { npmWhich } from 'npm-which';
import { emptyFunction } from 'fbjs';

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

  test.each`
    cliName              | expected
    ${'notFoundCommand'} | ${'process exit'}
    ${'runError'}        | ${'run error'}
  `(
    'Run fail with $cliName',
    ({ cliName, expected }: {| cliName: string, expected: string |}) => {
      npmWhich.throwError = cliName === 'notFoundCommand';

      expect(() => {
        cliOptions([...defaultArgv, cliName]);
      }).toThrow(expected);

      npmWhich.throwError = false;
    },
  );

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
    argv
    ${['--info']}
    ${['runCmd', '--info']}
    ${[]}
    ${['notFindCliName']}
  `('Run $argv', ({ argv }: {| argv: $ReadOnlyArray<string> |}) => {
    expect(() => {
      cliOptions([...defaultArgv, ...argv]);
    }).toThrow('process exit');
  });
});
