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
import { areEqual, emptyFunction } from 'fbjs';
import outputFileSync from 'output-file-sync';
import rimraf from 'rimraf';
import findCacheDir from 'find-cache-dir';

import defaultConfigs from './defaultConfigs';
import printInfos from './printInfos';

const CONFIG_FILES = {
  babel: 'babel.config.js',
  eslint: '.eslintrc.js',
  esw: '.eslintrc.js',
  prettier: '.prettierrc.js',
  'lint-staged': '.lintstagedrc.js',
  jest: 'jest.config.js',
};

const CONFIG_IGNORE = {
  eslint: '.eslintignore',
  esw: '.eslintignore',
  prettier: '.prettierignore',
};

/**
 * Use to store configs
 */
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
   * handle custom configs
   *
   * @example
   * configs.handleCustomConfigs()
   *
   * @param {string} customConfigsPath - give a custom config path
   *
   * @return {void} - no return
   */
  handleCustomConfigs = (customConfigsPath?: string) => {
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
   * handle config files
   *
   * @example
   * configs.handleConfigFiles('cli', 'cliName');
   *
   * @param {string} cli - cli of command
   * @param {string} cliName - cliName of configs
   *
   * @return {Object} - return config files
   */
  handleConfigFiles = (cli: string, cliName: string): {} => {
    let configFiles: {} = { ...this.store[cliName].configFiles };

    if (!configFiles[cliName]) {
      if (!CONFIG_FILES[cli])
        printInfos(
          [
            'Can not generate the config file',
            chalk`Add the path of the config in {cyan \`configs.${cliName}.configFiles.${cli}\`}`,
          ],
          true,
        );

      configFiles[cliName] = path.resolve(this.rootDir, CONFIG_FILES[cli]);
    }

    Object.keys(configFiles).forEach((key: string) => {
      const configFile = configFiles[key];

      if (typeof configFile === 'string') return;

      delete configFiles[key];

      if (configFile)
        configFiles = {
          ...configFiles,
          ...this.handleConfigFiles(this.store[key].alias || key, key),
        };
    });

    return configFiles;
  };

  /**
   * get ths config from cliName
   *
   * @example
   * configs.getConfig('cliName')
   *
   * @param {string} cliName - cliName to get config
   *
   * @return {Object} - config
   */
  getConfig = (cliName: string): {} => {
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

    const cacheDir = findCacheDir({
      name: 'configs',
      thunk: true,
      cwd: this.rootDir,
    });
    const cachePath = cacheDir('configs-scripts.json');
    const configFiles = this.handleConfigFiles(cli, cliName);

    const ignoreFiles = [];

    // generate configs and set in cache
    (() => {
      const cache = fs.existsSync(cachePath) ? require(cachePath) : {};

      Object.keys(configFiles).forEach((key: string) => {
        const configFile = configFiles[key];

        /** handle config */
        if (!cache[configFile]) cache[configFile] = [];

        cache[configFile].push({
          cwd: process.cwd(),
          argv: process.argv,
        });
        outputFileSync(
          configFile,
          `/* eslint-disable */ module.exports = require('@cat-org/configs')('${key}');`,
        );

        /** handle ignore */
        const {
          ignoreName,
          alias: ignoreCli = key,
          ignore: getIgnore,
        } = this.store[key];
        const ignoreFileName = ignoreName || CONFIG_IGNORE[ignoreCli];
        const ignore = getIgnore?.([]) || [];

        if (ignore.length !== 0 && ignoreFileName) {
          const ignorePath = path.resolve(
            path.dirname(configFile),
            ignoreFileName,
          );

          ignoreFiles.push({
            configPath: configFile,
            ignorePath,
          });
          outputFileSync(ignorePath, ignore.join('\n'));
        }
      });

      outputFileSync(cachePath, JSON.stringify(cache, null, 2));
    })();

    try {
      return {
        run,
        env,
        cli: npmWhich(process.cwd()).sync(cli),
        removeConfigFiles: (): Promise => {
          const cache = fs.existsSync(cachePath) ? require(cachePath) : {};
          const removeFilesP = [];

          Object.values(configFiles).forEach((configFile: string) => {
            cache[configFile] = cache[configFile].filter(
              (cacheConfig: {}): boolean =>
                !areEqual(cacheConfig, {
                  cwd: process.cwd(),
                  argv: process.argv,
                }),
            );

            if (cache[configFile].length !== 0) return;

            removeFilesP.push(
              new Promise(resolve => {
                const ignoreFile = ignoreFiles.find(
                  ({ configPath }: { configPath: string }): boolean =>
                    configPath === configFile,
                );

                rimraf.sync(configFile);

                if (ignoreFile) rimraf.sync(ignoreFile.ignorePath);
                resolve();
              }),
            );
          });

          outputFileSync(cachePath, JSON.stringify(cache, null, 2));

          return Promise.all(removeFilesP);
        },
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
