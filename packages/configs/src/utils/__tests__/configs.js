// @flow

import os from 'os';
import path from 'path';

import { emptyFunction } from 'fbjs';

import { Configs } from '../configs';

import defaultConfigs from 'configs/defaultConfigs';

const defaultParameter = {
  argv: [],
  shouldInstall: false,
  shouldUseNpm: false,
};

// for testing get config
defaultConfigs.noCli = emptyFunction.thatReturnsArgument;

// for testing config and install
defaultConfigs.funcConfig = emptyFunction.thatReturnsArgument;
defaultConfigs.emptyConfig = {
  config: emptyFunction.thatReturnsArgument,
};

defaultConfigs.funcMergeObject = emptyFunction.thatReturnsArgument;
defaultConfigs.objectMergeFunc = {
  config: emptyFunction.thatReturnsArgument,
};
defaultConfigs.customNoConfig = {
  config: emptyFunction.thatReturnsArgument,
};
defaultConfigs.defaultNoConfig = {};

describe('configs', () => {
  it('can not find the root dir', () => {
    const configs = new Configs();

    expect(() => {
      configs.findRootDir(os.homedir());
    }).toThrow('process exit');
  });

  it('default configs with finding the root dir', () => {
    const configs = new Configs();

    configs.handleCustomConfigs();
    configs.findRootDir(__dirname);

    expect(configs.store).toEqual(defaultConfigs);
    expect(configs.rootDir).toBe(process.cwd());
    expect(
      configs.getConfig({
        ...defaultParameter,
        cliName: 'jest',
      }),
    ).toEqual({
      argv: [],
      env: {},
      cli: path.resolve(process.cwd(), './node_modules/.bin/jest'),
    });
  });

  describe('get config', () => {
    const configs = new Configs();

    configs.handleCustomConfigs(
      path.resolve(__dirname, './__ignore__/configs.js'),
    );
    configs.findRootDir();

    test.each`
      testName                                    | cliName               | expected
      ${'not find command'}                       | ${'not find command'} | ${'process exit'}
      ${'show custom path info and not find cli'} | ${'noCli'}            | ${'process exit'}
      ${'get config error'}                       | ${'runError'}         | ${'run error'}
    `(
      '$testName',
      ({ cliName, expected }: { cliName: string, expected: string }) => {
        expect(() => {
          configs.getConfig({
            ...defaultParameter,
            cliName,
          });
        }).toThrow(expected);
      },
    );

    describe.each`
      type      | shouldUseNpm | argv
      ${'yarn'} | ${false}     | ${['yarn', 'add', '--dev']}
      ${'npm'}  | ${true}      | ${['npm', 'install', '-D']}
    `(
      'install',
      ({
        type,
        shouldUseNpm,
        argv,
      }: {
        type: string,
        shouldUseNpm: boolean,
        argv: $ReadOnlyArray<string>,
      }) => {
        it(`use ${type}`, () => {
          expect(
            configs.getConfig({
              ...defaultParameter,
              cliName: 'emptyConfig',
              shouldInstall: true,
              shouldUseNpm,
            }),
          ).toEqual({
            env: {},
            cli: 'install',
            argv,
          });
        });
      },
    );

    describe('config', () => {
      it('func config', () => {
        const { funcConfig } = configs.store;

        expect(typeof funcConfig).toBe('function');
        expect(funcConfig()).toEqual({});
      });

      it('empty config', () => {
        const { emptyConfig } = configs.store;

        expect(emptyConfig.config()).toEqual({});
        expect(emptyConfig.ignore()).toEqual([]);
        expect(emptyConfig.run([])).toEqual([]);
      });

      test.each`
        testName               | configName
        ${'func merge object'} | ${'funcMergeObject'}
        ${'object merge func'} | ${'objectMergeFunc'}
        ${'custom no config'}  | ${'customNoConfig'}
        ${'default no config'} | ${'defaultNoConfig'}
      `('$testName', ({ configName }: { configName: string }) => {
        expect(configs.store[configName].config()).toEqual({});
      });
    });
  });
});
