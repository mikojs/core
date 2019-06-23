/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import cosmiconfig from 'cosmiconfig';
import { emptyFunction } from 'fbjs';
import debug from 'debug';

import { type objConfigType, type configsType } from '../types';

import defaultConfigs from 'configs/defaultConfigs';

const debugLog = debug('configs:configs');

/** Store configs */
export class Configs {
  +store: { [string]: objConfigType } = {};

  rootDir = process.cwd();

  customConfigsPath = null;

  configsEnv = [];

  /**
   * @example
   * configs.addConfigsEnv({})
   *
   * @param {config} config - config from parent
   *
   * @return {config} - config with configsEnv
   */
  +addConfigsEnv = <C: {}>(
    config: C,
  ): {
    ...C,
    configsEnv: $ReadOnlyArray<string>,
  } => ({
    ...config,
    configsEnv: this.configsEnv,
  });

  /**
   * @example
   * configs.removeConfigsEnv({})
   *
   * @param {config} config - config with configsEnv
   *
   * @return {config} - configs without configsEnv
   */
  +removeConfigsEnv = <C: {}>({
    configsEnv,
    ...config
  }: {
    ...C,
    configsEnv: $ReadOnlyArray<string>,
  }): C => config;

  /**
   * @example
   * configs.handleCustomConfigs()
   *
   * @param {{ config, filepath }} customConfigsObj - custom config
   */
  +handleCustomConfigs = (
    customConfigsObj: ?{ config: configsType, filepath: string },
  ) => {
    if (!customConfigsObj) return;

    const {
      config: customConfigs,
      filepath: customConfigsPath,
    } = customConfigsObj;

    debugLog(customConfigsObj);
    this.customConfigsPath = customConfigsPath;
    this.rootDir = path.dirname(customConfigsPath);

    Object.keys(customConfigs).forEach((key: string) => {
      if (key === 'configsEnv') {
        this.configsEnv = customConfigs[key];
        return;
      }

      const customConfig: objConfigType =
        typeof customConfigs[key] === 'function'
          ? { config: customConfigs[key] }
          : customConfigs[key];
      const config = this.store[key];

      if (!config) {
        this.store[key] = customConfig;
        return;
      }

      this.store[key] = {
        alias: customConfig.alias || config.alias || key,
        install: (install: $ReadOnlyArray<string>) =>
          install
          |> config.install || emptyFunction.thatReturnsArgument
          |> customConfig.install || emptyFunction.thatReturnsArgument,
        config: <C: {}>(configObj: C) =>
          configObj
          |> this.addConfigsEnv
          |> config.config || emptyFunction.thatReturnsArgument
          |> this.addConfigsEnv
          |> customConfig.config || emptyFunction.thatReturnsArgument
          |> this.removeConfigsEnv,
        ignore: (ingore: $ReadOnlyArray<string>) =>
          ingore
          |> config.ignore || emptyFunction.thatReturnsArgument
          |> customConfig.ignore || emptyFunction.thatReturnsArgument,
        ignoreName: customConfig.ignoreName,
        run: (argv: $ReadOnlyArray<string>) =>
          argv
          |> config.run || emptyFunction.thatReturnsArgument
          |> customConfig.run || emptyFunction.thatReturnsArgument,
        env: {
          ...config.env,
          ...customConfig.env,
        },
        configFiles: {
          ...config.configFiles,
          ...customConfig.configFiles,
        },
      };
    });

    debugLog(this.store);
  };
}

const configs = new Configs();

configs.handleCustomConfigs({
  config: defaultConfigs,
  filepath: process.cwd(),
});
configs.handleCustomConfigs(cosmiconfig('cat').searchSync());

export default configs;
