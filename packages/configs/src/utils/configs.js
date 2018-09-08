// @flow

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
};

class Configs {
  store = { ...defaultConfigs };

  rootDir = null;

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

  handleCustomConfigs = (customConfigsPath?: string) => {
    if (!customConfigsPath) return;

    const customConfigs = require(customConfigsPath);

    printInfos(
      ['Using external configsuration', `Location: ${customConfigsPath}`],
      false,
    );

    this.rootDir = path.dirname(customConfigsPath);
    Object.keys(customConfigs).forEach((key: string) => {
      // handle custom configs is not in default customConfigs
      if (!this.store[key]) {
        this.store[key] = customConfigs[key];
        return;
      }

      // handle default and custom configs is object
      if (!this.store[key].config && !customConfigs[key].config) {
        this.store[key] = () =>
          null |> defaultConfigs[key] |> customConfigs[key];
        return;
      }

      this.store[key] = {
        alias: customConfigs[key].alias || defaultConfigs[key].alias || key,
        config: () =>
          null
          |> defaultConfigs[key].config ||
            (typeof defaultConfigs[key] === 'function'
              ? defaultConfigs[key]
              : emptyFunction.thatReturnsArgument)
          |> customConfigs[key].config ||
            (typeof customConfigs[key] === 'function'
              ? customConfigs[key]
              : emptyFunction.thatReturnsArgument),
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

  handleConfigFiles = (cli: string, cliName: string) => {
    let configFiles = { ...this.store[cliName].configFiles };

    if (!configFiles[cli]) {
      if (!CONFIG_FILES[cli])
        printInfos(
          [
            'Can not generate the config file',
            chalk`Add the path of the config in {cyan \`configs.${cliName}.configFiles.${cli}\`}`,
          ],
          true,
        );

      configFiles[cli] = path.resolve(this.rootDir, CONFIG_FILES[cli]);
    }

    Object.keys(configFiles).forEach((key: string) => {
      const subCliName = configFiles[key];

      if (this.store[subCliName]) {
        delete configFiles[key];

        configFiles = {
          ...this.handleConfigFiles(
            this.store[subCliName].alias || subCliName,
            subCliName,
          ),
          ...configFiles,
        };
      }
    });

    return configFiles;
  };

  getConfig = (cliName: string): {} => {
    if (!this.store[cliName])
      printInfos(
        [
          chalk`Can not find {cyan \`${cliName}\`} in configs`,
          chalk`Use {green \`--info\`} to get the more information`,
        ],
        true,
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

    // generate configs and set in cache
    (() => {
      const cache = fs.existsSync(cachePath) ? require(cachePath) : {};

      Object.values(configFiles).forEach((configFile: string) => {
        if (!cache[configFile]) cache[configFile] = [];

        cache[configFile].push({
          cwd: process.cwd(),
          argv: process.argv,
        });
        outputFileSync(
          configFile,
          `module.exports = require('@cat-org/configs')('${cliName}');`,
        );
      });

      outputFileSync(cachePath, JSON.stringify(cache, null, 2));
    })();

    try {
      return {
        run,
        env,
        cli: npmWhich(process.cwd()).sync(cli),
        removeConfigFiles: () => {
          const cache = fs.existsSync(cachePath) ? require(cachePath) : {};
          const removeFilesP = [];

          Object.values(configFiles).forEach((configFile: string) => {
            cache[configFile] = cache[configFile].filter(
              (cacheConfig: {}) =>
                !areEqual(cacheConfig, {
                  cwd: process.cwd(),
                  argv: process.argv,
                }),
            );

            if (cache[configFile].length !== 0) return;

            removeFilesP.push(
              new Promise(resolve => {
                rimraf(configFile, resolve);
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
