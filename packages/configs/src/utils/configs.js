/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import cosmiconfig from 'cosmiconfig';
import readPkgUp from 'read-pkg-up';
import { emptyFunction } from 'fbjs';
import debug from 'debug';

import defaultConfigs from 'configs/defaultConfigs';

const debugLog = debug('configs:configs');

/** Store configs */
export class Configs {
  store = { ...defaultConfigs };

  rootDir = null;

  customConfigsPath = false;

  /**
   * @example
   * configs.handleCustomConfigs()
   *
   * @param {string} customConfigsPath - set custom configsPath
   */
  handleCustomConfigs = (customConfigsPath?: string) => {
    if (!customConfigsPath) return;

    const customConfigs = require(customConfigsPath);

    debugLog(`Find custom configs path: ${customConfigsPath}`);
    this.customConfigsPath = customConfigsPath;
    this.rootDir = path.dirname(customConfigsPath);

    Object.keys(customConfigs).forEach((key: string) => {
      // handle custom configs is not in default customConfigs
      if (!this.store[key]) {
        this.store[key] = customConfigs[key];
        return;
      }

      // handle default and custom configs are function
      if (!this.store[key].config && !customConfigs[key].config) {
        const configs = this.store[key];

        this.store[key] = () => ({} |> configs |> customConfigs[key]);
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
          |> configs.config ||
            (typeof configs === 'function'
              ? configs
              : emptyFunction.thatReturnsArgument)
          |> customConfigs[key].config ||
            (typeof customConfigs[key] === 'function'
              ? customConfigs[key]
              : emptyFunction.thatReturnsArgument)),
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

configs.handleCustomConfigs(readPkgUp.sync().pkg?.configs);
configs.handleCustomConfigs(cosmiconfig('cat').searchSync()?.filepath);

export default configs;
