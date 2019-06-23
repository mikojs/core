// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import { Configs } from '../configs';

describe('configs', () => {
  const configs = new Configs();

  // default config
  configs.handleCustomConfigs({
    config: {
      funcConfig: emptyFunction.thatReturnsArgument,
      objConfig: {
        config: emptyFunction.thatReturnsArgument,
      },
      funcMergeObject: emptyFunction.thatReturnsArgument,
      objMergeFunc: {
        config: emptyFunction.thatReturnsArgument,
      },
      noConfigInDefault: {},
      noConfigInCustom: {
        config: emptyFunction.thatReturnsArgument,
      },
    },
    filepath: process.cwd(),
  });

  // handle no config
  configs.handleCustomConfigs();

  // custom config
  configs.handleCustomConfigs({
    config: {
      funcConfig: emptyFunction.thatReturnsArgument,
      objConfig: {
        config: emptyFunction.thatReturnsArgument,
      },
      funcMergeObject: {
        config: emptyFunction.thatReturnsArgument,
      },
      objMergeFunc: emptyFunction.thatReturnsArgument,
      noConfigInDefault: {
        config: emptyFunction.thatReturnsArgument,
      },
      noConfigInCustom: {},
    },
    filepath: path.resolve(__dirname, './customConfig.js'),
  });

  test.each`
    testName                         | configName
    ${'function config'}             | ${'funcConfig'}
    ${'object config'}               | ${'objConfig'}
    ${'func merge object'}           | ${'funcMergeObject'}
    ${'object merge func'}           | ${'objMergeFunc'}
    ${'no config in default config'} | ${'noConfigInDefault'}
    ${'no config in custom config'}  | ${'noConfigInCustom'}
  `('$testName', ({ configName }: {| configName: string |}) => {
    expect(configs.store[configName].config({})).toEqual({});
    expect(configs.store[configName].run([])).toEqual([]);
    expect(configs.store[configName].install([])).toEqual([]);
  });
});
