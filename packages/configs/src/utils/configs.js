/**
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import fs from 'fs';
import path from 'path';

import cosmiconfig from 'cosmiconfig';
import npmWhich from 'npm-which';
import chalk from 'chalk';
import { emptyFunction } from 'fbjs';

import defaultConfigs from './defaultConfigs';
import printInfos from './printInfos';

/** Store configs */
class Configs {
  store = { ...defaultConfigs };

  rootDir = null;

  customConfigsPath = false;

  /**
   * Find root directory
   *
   * @example
   * configs.findRootDir()
   */
  findRootDir = () => {
    if (this.rootDir) return;

    this.rootDir = process.cwd();

    while (
      this.rootDir !== '/' &&
      !fs.existsSync(path.resolve(this.rootDir, './.git'))
    )
      this.rootDir = path.resolve(this.rootDir, '..');

    if (this.rootDir === '/')
      printInfos(
        [
          'Can not find the root directory',
          chalk`Run {cyan \`git init\`} in the root directory`,
        ],
        true,
      );
  };

  /**
   * Handle custom configs
   *
   * @example
   * configs.handleCustomConfigs()
   */
  handleCustomConfigs = () => {
    const customConfigsPath = cosmiconfig('cat').searchSync()?.filepath;

    if (!customConfigsPath) return;

    const customConfigs = require(customConfigsPath);

    this.customConfigsPath = customConfigsPath;
    this.rootDir = path.dirname(customConfigsPath);

    Object.keys(customConfigs).forEach((key: string) => {
      // handle custom configs is not in default customConfigs
      if (!this.store[key]) {
        this.store[key] = customConfigs[key];
        return;
      }

      // handle default and custom configs is object
      if (!this.store[key].config && !customConfigs[key].config) {
        this.store[key] = (): {} =>
          null |> defaultConfigs[key] |> customConfigs[key];
        return;
      }

      this.store[key] = {
        alias: customConfigs[key].alias || defaultConfigs[key].alias || key,
        config: (): {} =>
          null
          |> defaultConfigs[key].config ||
            (typeof defaultConfigs[key] === 'function'
              ? defaultConfigs[key]
              : emptyFunction.thatReturnsArgument)
          |> customConfigs[key].config ||
            (typeof customConfigs[key] === 'function'
              ? customConfigs[key]
              : emptyFunction.thatReturnsArgument),
        ignore: (ignore: $ReadOnlyArray<string>): $ReadOnlyArray<string> =>
          ignore
          |> defaultConfigs[key].ignore || emptyFunction.thatReturnsArgument
          |> customConfigs[key].ignore || emptyFunction.thatReturnsArgument,
        ignoreName: customConfigs[key].ignoreName,
        run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> =>
          argv
          |> defaultConfigs[key].run || emptyFunction.thatReturnsArgument
          |> customConfigs[key].run || emptyFunction.thatReturnsArgument,
        env: {
          ...defaultConfigs[key].env,
          ...customConfigs[key].env,
        },
        configFiles: {
          ...defaultConfigs[key].configFiles,
          ...customConfigs[key].configFiles,
        },
      };
    });
  };

  /**
   * Get ths config from cliName
   *
   * @example
   * configs.getConfig(cliOptions)
   *
   * @param {Object} cliOptions - cliOptions in utils
   *
   * @return {Object} - config
   */
  getConfig = ({
    cliName,
    argv,
  }: {
    cliName: string,
    argv: $ReadOnlyArray<string>,
  }): {} => {
    if (!this.store[cliName])
      printInfos(
        [
          chalk`Can not find {cyan \`${cliName}\`} in configs`,
          chalk`Use {green \`--info\`} to get the more information`,
        ],
        true,
      );

    if (this.customConfigsPath)
      printInfos(
        [
          'Using external configsuration',
          `Location: ${this.customConfigsPath}`,
        ],
        false,
      );

    const {
      run = emptyFunction.thatReturnsArgument,
      env = {},
      alias: cli = cliName,
    } = this.store[cliName];

    try {
      return {
        argv: run(argv),
        env,
        cli: npmWhich(process.cwd()).sync(cli),
      };
    } catch (e) {
      if (/not found/.test(e.message))
        printInfos([e.message.replace(/not found/, 'Not found cli')], true);

      throw e;
    }
  };
}

const configs = new Configs();

configs.handleCustomConfigs();
configs.findRootDir();

export default configs;
