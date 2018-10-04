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

// $FlowFixMe add value to defaultConfigs for testing
defaultConfigs.noCli = emptyFunction.thatReturnsArgument;
// $FlowFixMe add value to defaultConfigs for testing
defaultConfigs.funcConfig = emptyFunction.thatReturnsArgument;
// $FlowFixMe add value to defaultConfigs for testing
defaultConfigs.emptyConfig = {
  config: emptyFunction.thatReturnsArgument,
};
// $FlowFixMe add value to defaultConfigs for testing
defaultConfigs.funcMergeObject = emptyFunction.thatReturnsArgument;
// $FlowFixMe add value to defaultConfigs for testing
defaultConfigs.objectMergeFunc = {
  config: emptyFunction.thatReturnsArgument,
};
// $FlowFixMe add value to defaultConfigs for testing
defaultConfigs.customNoConfig = {
  config: emptyFunction.thatReturnsArgument,
};
// $FlowFixMe add value to defaultConfigs for testing
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
    const customConfigsPath = path.resolve(
      __dirname,
      './__ignore__/configs.js',
    );

    configs.handleCustomConfigs(customConfigsPath);
    configs.findRootDir();

    it('not find command', () => {
      expect(() => {
        configs.getConfig({
          ...defaultParameter,
          cliName: 'not find command',
        });
      }).toThrow('process exit');
    });

    it('show custom path info and not find cli', () => {
      expect(() => {
        configs.getConfig({
          ...defaultParameter,
          cliName: 'noCli',
        });
      }).toThrow('process exit');
    });

    it('get config error', () => {
      expect(() => {
        configs.getConfig({
          ...defaultParameter,
          cliName: 'runError',
        });
      }).toThrow('run error');
    });

    describe('install', () => {
      const defaultResultConfig = {
        env: {},
        cli: 'install',
      };

      it('use yarn', () => {
        expect(
          configs.getConfig({
            ...defaultParameter,
            shouldInstall: true,
            cliName: 'emptyConfig',
          }),
        ).toEqual({
          ...defaultResultConfig,
          argv: ['yarn', 'add', '--dev'],
        });
      });

      it('use npm', () => {
        expect(
          configs.getConfig({
            ...defaultParameter,
            shouldInstall: true,
            shouldUseNpm: true,
            cliName: 'emptyConfig',
          }),
        ).toEqual({
          ...defaultResultConfig,
          argv: ['npm', 'install', '-D'],
        });
      });
    });

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

      it('func merge object', () => {
        expect(configs.store.funcMergeObject.config()).toEqual({});
      });

      it('object merge func', () => {
        expect(configs.store.objectMergeFunc.config()).toEqual({});
      });

      it('custom no config', () => {
        expect(configs.store.customNoConfig.config()).toEqual({});
      });

      it('default no config', () => {
        expect(configs.store.defaultNoConfig.config()).toEqual({});
      });
    });
  });
});
