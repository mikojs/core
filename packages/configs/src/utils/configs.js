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

import defaultConfigs from 'configs/defaultConfigs';

const debugLog = debug('configs:configs');

/** Store configs */
export class Configs {
  +store = {};

  +rootDir = process.cwd();

  +customConfigsPath = null;

  +configsEnv = [];

  /**
   * @example
   * configs.init()
   */
  -init = () => {
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
   * @param {Object} config - config from parent
   *
   * @return {Object} - config with configsEnv
   */
  -addConfigsEnv = (config: {}) => ({
    ...config,
    configsEnv: this.configsEnv,
  });

  /**
   * @example
   * configs.removeConfigsEnv({})
   *
   * @param {Object} config - config with configsEnv
   *
   * @return {Object} - configs without configsEnv
   */
  -removeConfigsEnv = ({ configsEnv, ...config }: {}) => config;

  /**
   * @example
   * configs.handleCustomConfigs()
   *
   * @param {string} customConfigsPath - set custom configsPath
   */
  +handleCustomConfigs = (customConfigsPath?: string) => {
    if (!customConfigsPath) return;

    const customConfigs = require(customConfigsPath);

    debugLog(`Find custom configs path: ${customConfigsPath}`);
    this.customConfigsPath = customConfigsPath;
    this.rootDir = path.dirname(customConfigsPath);

    Object.keys(customConfigs).forEach((key: string) => {
      if (key === 'configsEnv') {
        this.configsEnv = customConfigs[key];
        return;
      }

      // handle custom configs is not in default customConfigs
      if (!this.store[key]) {
        // handle custom configs is a function
        if (typeof customConfigs[key] === 'function')
          this.store[key] = () =>
            ({}
            |> this.addConfigsEnv
            |> customConfigs[key]
            |> this.removeConfigsEnv);
        // handle custom configs is not a function
        else {
          const { config, ...otherSettings } = customConfigs[key];

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
      if (!this.store[key].config && !customConfigs[key].config) {
        const configs = this.store[key];

        this.store[key] = () =>
          ({}
          |> this.addConfigsEnv
          |> configs
          |> this.addConfigsEnv
          |> customConfigs[key]
          |> this.removeConfigsEnv);
        return;
      }

      const configs =
        typeof this.store[key] === 'function'
          ? this.store[key]
          : { ...this.store[key] };

      // handle default or custom configs is object
      this.store[key] = {
        alias: customConfigs[key].alias || configs.alias || key,
        install: (install: $ReadOnlyArray<string>) =>
          install
          |> configs.install || emptyFunction.thatReturnsArgument
          |> customConfigs[key].install || emptyFunction.thatReturnsArgument,
        config: () =>
          ({}
          |> this.addConfigsEnv
          |> configs.config || configs
          |> this.addConfigsEnv
          |> customConfigs[key].config ||
            (typeof customConfigs[key] === 'function'
              ? customConfigs[key]
              : emptyFunction.thatReturnsArgument)
          |> this.removeConfigsEnv),
        ignore: () =>
          []
          |> configs.ignore || emptyFunction.thatReturnsArgument
          |> customConfigs[key].ignore || emptyFunction.thatReturnsArgument,
        ignoreName: customConfigs[key].ignoreName,
        run: (argv: $ReadOnlyArray<string>) =>
          argv
          |> configs.run || emptyFunction.thatReturnsArgument
          |> customConfigs[key].run || emptyFunction.thatReturnsArgument,
        env: {
          ...configs.env,
          ...customConfigs[key].env,
        },
        configFiles: {
          ...configs.configFiles,
          ...customConfigs[key].configFiles,
        },
      };
    });

    debugLog(this.store);
  };
}

const configs = new Configs();

configs.init();
configs.handleCustomConfigs(cosmiconfig('cat').searchSync()?.filepath);

export default configs;
