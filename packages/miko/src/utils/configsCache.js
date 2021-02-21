/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import { emptyFunction } from 'fbjs';
import { cosmiconfigSync } from 'cosmiconfig';

import createLogger from '@mikojs/logger';

type configsType = {
  [string]: {|
    filenames?: {|
      config?: string,
    |},
    config?: (config: {}) => {},
  |},
};

export type initialConfigsType = {
  [string]:
    | $NonMaybeType<$PropertyType<$ElementType<configsType, string>, 'config'>>
    | $ElementType<configsType, string>,
};

type configObjType = {|
  config:
    | initialConfigsType
    | $ReadOnlyArray<initialConfigsType | $ReadOnlyArray<initialConfigsType>>,
  filepath: string,
|};

export type configsCacheType = {|
  keys: () => $ReadOnlyArray<string>,
  resolve: (filePath: string) => string,
  get: (
    configName: string,
  ) => {|
    ...$Diff<$ElementType<configsType, string>, {| filenames: mixed |}>,
    configFile: ?[string, string],
  |},
  load: (configObj: ?configObjType) => configsCacheType,
  addConfig: (
    configsArray: $ReadOnlyArray<initialConfigsType>,
  ) => configsCacheType,
|};

const logger = createLogger('@mikojs/miko:configsCache');

export default (((): configsCacheType => {
  const cache = {
    cwd: process.cwd(),
    configs: {},
  };
  const result = {
    /**
     * @return {Array} - configs array
     */
    keys: () => Object.keys(cache.configs),

    /**
     * @param {string} filePath - config file path
     *
     * @return {string} - absolute config file path
     */
    resolve: (filePath: string) => path.resolve(cache.cwd, filePath),

    /**
     * @param {string} configName - config name
     *
     * @return {object} - config object
     */
    get: (
      configName: string,
    ): $Call<$PropertyType<configsCacheType, 'get'>, string> => {
      if (!cache.configs[configName]) return {};

      const { filenames, config } = cache.configs[configName];
      const configFilename = filenames?.config;

      return {
        config,
        configFile:
          !configFilename || !config
            ? null
            : [
                result.resolve(configFilename),
                `/* eslint-disable */ module.exports = require('@mikojs/miko')('${configName}');`,
              ],
      };
    },

    /**
     * @param {configObjType} configObj - config object
     *
     * @return {configsCacheType} - configsCache object
     */
    load: (configObj: ?configObjType): configsCacheType => {
      if (!configObj) return result;

      const { config, filepath } = configObj;

      cache.cwd = path.dirname(filepath);
      logger.debug({ config, filepath }, cache);

      return (config instanceof Array ? config : [config]).reduce(
        (
          newResult: configsCacheType,
          oneOrArrayConfigs:
            | initialConfigsType
            | $ReadOnlyArray<initialConfigsType>,
        ) =>
          newResult.addConfig(
            oneOrArrayConfigs instanceof Array
              ? oneOrArrayConfigs
              : [oneOrArrayConfigs],
          ),
        result,
      );
    },

    /**
     * @param {initialConfigsType} configsArray - configs array
     *
     * @return {configsCacheType} - configsCache object
     */
    addConfig: (
      configsArray: $ReadOnlyArray<initialConfigsType>,
    ): configsCacheType => {
      configsArray.forEach((configs: initialConfigsType) => {
        Object.keys(configs).forEach((key: string) => {
          const prevConfig = cache.configs[key] || {};
          const newConfig: $ElementType<configsType, string> =
            typeof configs[key] !== 'function'
              ? configs[key]
              : { config: configs[key] };

          cache.configs[key] = {
            filenames: {
              ...prevConfig.filenames,
              ...newConfig.filenames,
            },

            /**
             * @param {object} config - prev config
             *
             * @return {object} - new config
             */
            config: (config: {}) =>
              config
              |> prevConfig.config || emptyFunction.thatReturnsArgument
              |> newConfig.config || emptyFunction.thatReturnsArgument,
          };
        });
      });
      logger.debug(configsArray, cache);

      return result;
    },
  };

  return result.load(cosmiconfigSync('miko').search());
})(): configsCacheType);
