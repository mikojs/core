// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import { Configs } from '../configs';

import defaultConfigs from 'configs/defaultConfigs';

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
  const configs = new Configs();

  configs.handleCustomConfigs();
  configs.handleCustomConfigs(
    path.resolve(__dirname, './__ignore__/configs.js'),
  );

  test('func config', () => {
    const { funcConfig } = configs.store;

    expect(typeof funcConfig).toBe('function');
    expect(funcConfig()).toEqual({});
  });

  test('empty config', () => {
    const { emptyConfig } = configs.store;

    expect(emptyConfig.config()).toEqual({});
    expect(emptyConfig.ignore()).toEqual([]);
    expect(emptyConfig.run([])).toEqual([]);
    expect(emptyConfig.install([])).toEqual([]);
  });

  test.each`
    testName               | configName
    ${'not in default'}    | ${'notInDefault'}
    ${'func merge object'} | ${'funcMergeObject'}
    ${'object merge func'} | ${'objectMergeFunc'}
    ${'custom no config'}  | ${'customNoConfig'}
    ${'default no config'} | ${'defaultNoConfig'}
  `('$testName', ({ configName }: {| configName: string |}) => {
    expect(configs.store[configName].config()).toEqual({});
  });
});
