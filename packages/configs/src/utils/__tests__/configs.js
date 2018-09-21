// @flow

import os from 'os';
import path from 'path';

import { emptyFunction } from 'fbjs';

import { Configs } from '../configs';
import defaultConfigs from '../defaultConfigs';

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
    const mockLog = jest.fn();
    const configs = new Configs();

    global.console.log = mockLog;

    expect(() => {
      configs.findRootDir(os.homedir());
    }).toThrow('process exit');
    expect(configs.rootDir).toBe('/');
    expect(mockLog).toHaveBeenCalledTimes(3);
    expect(mockLog).toHaveBeenCalledWith(
      '  {red configs-scripts} Can not find the root directory',
    );
    expect(mockLog).toHaveBeenCalledWith(
      '  {red configs-scripts} Run {cyan `git init`} in the root directory',
    );
  });

  it('default configs with finding the root dir', () => {
    const mockLog = jest.fn();
    const configs = new Configs();

    global.console.log = mockLog;
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
    expect(mockLog).toHaveBeenCalledTimes(0);
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
      const mockLog = jest.fn();

      global.console.log = mockLog;

      expect(() => {
        configs.getConfig({
          ...defaultParameter,
          cliName: 'not find command',
        });
      }).toThrow('process exit');
      expect(mockLog).toHaveBeenCalledTimes(3);
      expect(mockLog).toHaveBeenCalledWith(
        '  {red configs-scripts} Can not find {cyan `not find command`} in configs',
      );
      expect(mockLog).toHaveBeenCalledWith(
        '  {red configs-scripts} Use {green `--info`} to get the more information',
      );
    });

    it('show custom path info and not find cli', () => {
      const mockLog = jest.fn();

      global.console.log = mockLog;

      expect(() => {
        configs.getConfig({
          ...defaultParameter,
          cliName: 'noCli',
        });
      }).toThrow('process exit');
      expect(mockLog).toHaveBeenCalledTimes(4);
      expect(mockLog).toHaveBeenCalledWith(
        '  {green configs-scripts} Using external configsuration',
      );
      expect(mockLog).toHaveBeenCalledWith(
        `  {green configs-scripts} Location: ${customConfigsPath}`,
      );
      expect(mockLog).toHaveBeenCalledWith(
        '  {red configs-scripts} Not found cli: noCli',
      );
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
