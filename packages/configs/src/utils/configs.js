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
import debug from 'debug';

import defaultConfigs from './defaultConfigs';
import printInfos from './printInfos';

const debugLog = debug('configs-scripts:configs');

/** Store configs */
export class Configs {
  store = { ...defaultConfigs };

  rootDir = null;

  customConfigsPath = false;

  /**
   * Handle custom configs
   *
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
        this.store[key] = (): {} =>
          ({} |> defaultConfigs[key] |> customConfigs[key]);
        return;
      }

      // handle default or custom configs is object
      this.store[key] = {
        alias: customConfigs[key].alias || defaultConfigs[key].alias || key,
        install: (install: $ReadOnlyArray<string>): $ReadOnlyArray<string> =>
          install
          |> defaultConfigs[key].install || emptyFunction.thatReturnsArgument
          |> customConfigs[key].install || emptyFunction.thatReturnsArgument,
        config: (): {} =>
          ({}
          |> defaultConfigs[key].config ||
            (typeof defaultConfigs[key] === 'function'
              ? defaultConfigs[key]
              : emptyFunction.thatReturnsArgument)
          |> customConfigs[key].config ||
            (typeof customConfigs[key] === 'function'
              ? customConfigs[key]
              : emptyFunction.thatReturnsArgument)),
        ignore: (): $ReadOnlyArray<string> =>
          []
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

      debugLog('Configs');
      debugLog(this.store);
    });
  };

  /**
   * Find root directory
   *
   * @example
   * configs.findRootDir()
   *
   * @param {string} cwd - cwd to find the root dir
   */
  findRootDir = (cwd?: string = process.cwd()) => {
    if (this.rootDir) return;

    this.rootDir = cwd;

    while (
      this.rootDir !== '/' &&
      !fs.existsSync(path.resolve(this.rootDir, './.git'))
    )
      this.rootDir = path.resolve(this.rootDir, '..');

    debugLog(`Find rood dir: ${this.rootDir}`);

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
    shouldInstall,
    shouldUseNpm,
  }: {
    cliName: string,
    argv: $ReadOnlyArray<string>,
    shouldInstall: boolean,
    shouldUseNpm: boolean,
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
      alias: cli = cliName,
      install = emptyFunction.thatReturnsArgument,
      run = emptyFunction.thatReturnsArgument,
      env = {},
    } = this.store[cliName];

    debugLog('Get config');
    debugLog({
      cli,
      install,
      run,
      env,
    });

    try {
      return {
        argv: shouldInstall
          ? install(
              shouldUseNpm
                ? ['npm', 'install', '-D']
                : ['yarn', 'add', '--dev'],
            )
          : run(argv),
        env,
        cli: shouldInstall ? 'install' : npmWhich(process.cwd()).sync(cli),
      };
    } catch (e) {
      if (/not found/.test(e.message))
        printInfos([e.message.replace(/not found/, 'Not found cli')], true);

      throw e;
    }
  };
}

const configs = new Configs();

configs.handleCustomConfigs(cosmiconfig('cat').searchSync()?.filepath);
configs.findRootDir();

export default configs;
