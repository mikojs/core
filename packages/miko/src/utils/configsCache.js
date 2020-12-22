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
import debug from 'debug';

type configsType = {
  [string]: {|
    filenames?: {|
      config?: string,
      ignore?: string,
    |},
    config?: (config: {}) => {},
    ignore?: (ignore: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
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
    ignoreFile: ?[string, string],
  |},
  load: (configObj: ?configObjType) => configsCacheType,
  addConfig: (
    configsArray: $ReadOnlyArray<initialConfigsType>,
  ) => configsCacheType,
|};

const debugLog = debug('miko:configsCache');

export default (((): configsCacheType => {
  const configsCache = {
    cwd: process.cwd(),
    configs: {},
  };
  const result = {
    /**
     * @return {Array} - configs array
     */
    keys: () => Object.keys(configsCache.configs),

    /**
     * @param {string} filePath - config file path
     *
     * @return {string} - absolute config file path
     */
    resolve: (filePath: string) => path.resolve(configsCache.cwd, filePath),

    /**
     * @param {string} configName - config name
     *
     * @return {object} - config object
     */
    get: (
      configName: string,
    ): $Call<$PropertyType<configsCacheType, 'get'>, string> => {
      if (!configsCache.configs[configName]) return {};

      const { filenames, config, ignore } = configsCache.configs[configName];
      const configFilename = filenames?.config;
      const ignoreFilename = filenames?.ignore;

      return {
        config,
        ignore,
        configFile:
          !configFilename || !config
            ? null
            : [
                result.resolve(configFilename),
                `/* eslint-disable */ module.exports = require('@mikojs/miko')('${configName}');`,
              ],
        ignoreFile:
          !ignoreFilename || !ignore
            ? null
            : [result.resolve(ignoreFilename), ignore([]).join('\n')],
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

      configsCache.cwd = path.dirname(filepath);
      debugLog({ config, filepath });
      debugLog(configsCache);

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
          const prevConfig = configsCache.configs[key] || {};
          const newConfig: $ElementType<configsType, string> =
            typeof configs[key] !== 'function'
              ? configs[key]
              : { config: configs[key] };

          configsCache.configs[key] = {
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

            /**
             * @param {Array} ignore - prev ignore array
             *
             * @return {Array} - new ignore array
             */
            ignore: (ignore: $ReadOnlyArray<string>) =>
              ignore
              |> prevConfig.ignore || emptyFunction.thatReturnsArgument
              |> newConfig.ignore || emptyFunction.thatReturnsArgument,
          };
        });
      });
      debugLog(configsArray);
      debugLog(configsCache);

      return result;
    },
  };

  return result.load(cosmiconfigSync('miko').search());
})(): configsCacheType);
