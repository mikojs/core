/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import { cosmiconfigSync } from 'cosmiconfig';
import { emptyFunction } from 'fbjs';
import debug from 'debug';

import { type objConfigType, type configsType } from '../types';

import defaultConfigs from 'configs';

const debugLog = debug('configs:configs');

/** Store configs */
export class Configs {
  +store: { [string]: objConfigType } = {};

  rootDir = process.cwd();

  customConfigsPath = null;

  /**
   * @example
   * configs.handleCustomConfigs()
   *
   * @param {{ config: configsType, filepath: string }} customConfigsObj - custom config
   */
  +handleCustomConfigs = (
    customConfigsObj: ?{ config: configsType, filepath: string },
  ) => {
    if (!customConfigsObj) return;

    const {
      config: customConfigs,
      filepath: customConfigsPath,
    } = customConfigsObj;

    if (customConfigsPath !== __dirname) {
      debugLog(customConfigsObj);
      this.customConfigsPath = customConfigsPath;
      this.rootDir = path.dirname(customConfigsPath);
    }

    Object.keys(customConfigs).forEach((key: string) => {
      const customConfig: objConfigType =
        typeof customConfigs[key] !== 'function'
          ? customConfigs[key]
          : { config: customConfigs[key] };
      const config = this.store[key];

      if (!config) {
        this.store[key] = customConfig;
        return;
      }

      this.store[key] = {
        alias: customConfig.alias || config.alias,
        install: (install: $ReadOnlyArray<string>) =>
          install
          |> config.install || emptyFunction.thatReturnsArgument
          |> customConfig.install || emptyFunction.thatReturnsArgument,
        config: (configObj: {}) =>
          configObj
          |> config.config || emptyFunction.thatReturnsArgument
          |> customConfig.config || emptyFunction.thatReturnsArgument,
        ignore: (ignore?: {|
          name?: string,
          ignore?: $ReadOnlyArray<string>,
        |}) =>
          ignore
          |> config.ignore || emptyFunction.thatReturnsArgument
          |> customConfig.ignore || emptyFunction.thatReturnsArgument,
        run: (argv: $ReadOnlyArray<string>) =>
          argv
          |> config.run || emptyFunction.thatReturnsArgument
          |> customConfig.run || emptyFunction.thatReturnsArgument,
        env: {
          ...(config.env || {}),
          ...(customConfig.env || {}),
        },
        configsFiles: {
          ...(config.configsFiles || {}),
          ...(customConfig.configsFiles || {}),
        },
      };
    });

    debugLog(this.store);
  };
}

const configs = new Configs();

configs.handleCustomConfigs({
  config: defaultConfigs,
  filepath: __dirname,
});
configs.handleCustomConfigs(cosmiconfigSync('cat').search());

export default configs;
