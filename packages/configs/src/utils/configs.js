/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import fs from 'fs';
import path from 'path';

import cosmiconfig from 'cosmiconfig';
import readPkgUp from 'read-pkg-up';
import npmWhich from 'npm-which';
import chalk from 'chalk';
import { emptyFunction } from 'fbjs';
import debug from 'debug';

import logger from './logger';

import defaultConfigs from 'configs/defaultConfigs';

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
        const configs = this.store[key];

        this.store[key] = (): {} => ({} |> configs |> customConfigs[key]);
        return;
      }

      const configs =
        typeof this.store[key] === 'function'
          ? this.store[key]
          : { ...this.store[key] };

      // handle default or custom configs is object
      this.store[key] = {
        alias: customConfigs[key].alias || configs.alias || key,
        install: (install: $ReadOnlyArray<string>): $ReadOnlyArray<string> =>
          install
          |> configs.install || emptyFunction.thatReturnsArgument
          |> customConfigs[key].install || emptyFunction.thatReturnsArgument,
        config: (): {} =>
          ({}
          |> configs.config ||
            (typeof configs === 'function'
              ? configs
              : emptyFunction.thatReturnsArgument)
          |> customConfigs[key].config ||
            (typeof customConfigs[key] === 'function'
              ? customConfigs[key]
              : emptyFunction.thatReturnsArgument)),
        ignore: (): $ReadOnlyArray<string> =>
          []
          |> configs.ignore || emptyFunction.thatReturnsArgument
          |> customConfigs[key].ignore || emptyFunction.thatReturnsArgument,
        ignoreName: customConfigs[key].ignoreName,
        run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> =>
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
      logger.fail(
        'Can not find the root directory',
        chalk`Run {cyan \`git init\`} in the root directory`,
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
      logger.fail(
        chalk`Can not find {cyan \`${cliName}\`} in configs`,
        chalk`Use {green \`--info\`} to get the more information`,
      );

    if (this.customConfigsPath)
      logger.info(
        'Using external configsuration',
        `Location: ${this.customConfigsPath}`,
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
        logger.fail(e.message.replace(/not found/, 'Not found cli'));

      throw e;
    }
  };
}

const configs = new Configs();

configs.handleCustomConfigs(readPkgUp.sync().pkg?.configs);
configs.handleCustomConfigs(cosmiconfig('cat').searchSync()?.filepath);
configs.findRootDir();

export default configs;
