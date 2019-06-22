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

import { type configType } from '../types';

import defaultConfigs from 'configs/defaultConfigs';

const debugLog = debug('configs:configs');

/** Store configs */
export class Configs {
  +store: { [string]: configType } = {};

  rootDir = process.cwd();

  customConfigsPath = null;

  configsEnv = [];

  /**
   * @example
   * configs.init()
   */
  +init = () => {
    Object.keys(defaultConfigs).forEach((key: string) => {
      if (typeof defaultConfigs[key] === 'function') {
        this.store[key] = () =>
          ({}
          |> this.addConfigsEnv
          |> defaultConfigs[key]
          |> this.removeConfigsEnv);
        return;
      }

      const { config, ...otherSettings } = defaultConfigs[key];

      this.store[key] = { ...otherSettings };
      this.store[key].config = () =>
        ({}
        |> this.addConfigsEnv
        |> config || emptyFunction.thatReturnsArgument
        |> this.removeConfigsEnv);
    });
  };

  /**
   * @example
   * configs.addConfigsEnv({})
   *
   * @param {config} config - config from parent
   *
   * @return {config} - config with configsEnv
   */
  +addConfigsEnv = (config: {}) => ({
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
  +removeConfigsEnv = ({ configsEnv, ...config }: {}) => config;

  /**
   * @example
   * configs.handleCustomConfigs()
   *
   * @param {{ config, filepath }} customConfigsObj - custom config
   */
  +handleCustomConfigs = (
    customConfigsObj: ?{ config: { [string]: configType }, filepath: string },
  ) => {
    if (!customConfigsObj) return;

    const {
      config: customConfigs,
      filepath: customConfigsPath,
    } = customConfigsObj;

    debugLog(`Find custom configs path: ${customConfigsPath}`);
    this.customConfigsPath = customConfigsPath;
    this.rootDir = path.dirname(customConfigsPath);

    Object.keys(customConfigs).forEach((key: string) => {
      const customConfig = customConfigs[key];

      if (key === 'configsEnv') {
        this.configsEnv = customConfig;
        return;
      }

      // handle custom configs is not in default customConfigs
      if (!this.store[key]) {
        // handle custom configs is a function
        if (typeof customConfig === 'function')
          this.store[key] = () =>
            ({} |> this.addConfigsEnv |> customConfig |> this.removeConfigsEnv);
        // handle custom configs is not a function
        else {
          const { config, ...otherSettings } = customConfig;

          this.store[key] = { ...otherSettings };
          this.store[key].config = () =>
            ({}
            |> this.addConfigsEnv
            |> config || emptyFunction.thatReturnsArgument
            |> this.removeConfigsEnv);
        }

        return;
      }

      // handle default and custom configs are function
      if (!this.store[key].config && !customConfig.config) {
        const configs = this.store[key];

        this.store[key] = () =>
          ({}
          |> this.addConfigsEnv
          |> configs
          |> this.addConfigsEnv
          |> customConfig
          |> this.removeConfigsEnv);
        return;
      }

      const configs =
        typeof this.store[key] === 'function'
          ? this.store[key]
          : { ...this.store[key] };

      // handle default or custom configs is object
      this.store[key] = {
        alias: customConfig.alias || configs.alias || key,
        install: (install: $ReadOnlyArray<string>) =>
          install
          |> configs.install || emptyFunction.thatReturnsArgument
          |> customConfig.install || emptyFunction.thatReturnsArgument,
        config: () =>
          ({}
          |> this.addConfigsEnv
          |> configs.config || configs
          |> this.addConfigsEnv
          |> customConfig.config ||
            (typeof customConfig === 'function'
              ? customConfig
              : emptyFunction.thatReturnsArgument)
          |> this.removeConfigsEnv),
        ignore: () =>
          []
          |> configs.ignore || emptyFunction.thatReturnsArgument
          |> customConfig.ignore || emptyFunction.thatReturnsArgument,
        ignoreName: customConfig.ignoreName,
        run: (argv: $ReadOnlyArray<string>) =>
          argv
          |> configs.run || emptyFunction.thatReturnsArgument
          |> customConfig.run || emptyFunction.thatReturnsArgument,
        env: {
          ...configs.env,
          ...customConfig.env,
        },
        configFiles: {
          ...configs.configFiles,
          ...customConfig.configFiles,
        },
      };
    });

    debugLog(this.store);
  };
}

const configs = new Configs();

configs.init();
configs.handleCustomConfigs(cosmiconfig('cat').searchSync());

export default configs;
