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

  test('run command with configsEnv', () => {
    expect(
      cliOptions([...defaultArgv, 'runCmd', '--configs-env', 'react']),
    ).toEqual({
      cli: babelCli,
      argv: [...defaultArgv, '--configs-env', 'react'],
      env: {},
      cliName: 'runCmd',
    });
    expect(configs.configsEnv).toEqual(['react']);
  });

  test.each`
    cliName     | options          | cli          | argv
    ${'runCmd'} | ${['--install']} | ${'install'} | ${['yarn', 'add', '--dev']}
    ${'runCmd'} | ${[]}            | ${babelCli}  | ${defaultArgv}
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
