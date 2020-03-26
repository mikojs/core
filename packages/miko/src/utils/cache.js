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

type initialConfigsType = {
  [string]:
    | $NonMaybeType<$PropertyType<$ElementType<configsType, string>, 'config'>>
    | $ElementType<configsType, string>,
};

export type cacheType = {|
  keys: () => $ReadOnlyArray<string>,
  resolve: (filePath: string) => string,
  get: (
    configName: string,
  ) => {|
    ...$Diff<$ElementType<configsType, string>, {| filenames: mixed |}>,
    configFile: ?[string, string],
    ignoreFile: ?[string, string],
  |},
  load: () => cacheType,
  addConfig: (
    oneOrArrayConfigs: ?(
      | initialConfigsType
      | $ReadOnlyArray<initialConfigsType>
    ),
  ) => cacheType,
|};

const debugLog = debug('miko:cache');

/**
 * @example
 * buildCache()
 *
 * @return {cacheType} - configs cache
 */
const buildCache = (): cacheType => {
  const cache = {
    cwd: process.cwd(),
    configs: {},
  };
  const result = {
    keys: () => Object.keys(cache.configs),
    resolve: (filePath: string) => path.resolve(cache.cwd, filePath),

    get: (
      configName: string,
    ): $Call<$PropertyType<cacheType, 'get'>, string> => {
      const { filenames, config, ignore } = cache.configs[configName];
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

    load: (): cacheType => {
      const { config, filepath } = cosmiconfigSync('miko').search() || {};

      cache.cwd = filepath || process.cwd();
      debugLog({ config, filepath });
      debugLog(cache);

      return result.addConfig(config);
    },

    addConfig: (
      oneOrArrayConfigs: ?(
        | initialConfigsType
        | $ReadOnlyArray<initialConfigsType>
      ),
    ): cacheType => {
      (oneOrArrayConfigs instanceof Array
        ? oneOrArrayConfigs
        : [oneOrArrayConfigs]
      )
        .filter(Boolean)
        .forEach((configs: initialConfigsType) => {
          Object.keys(configs).forEach((key: string) => {
            const prevConfig = cache.configs[key];
            const newConfig: $ElementType<configsType, string> =
              typeof configs[key] !== 'function'
                ? configs[key]
                : { config: configs[key] };

            cache.configs[key] = {
              filenames: {
                ...prevConfig.filenames,
                ...newConfig.filenames,
              },
              config: (config: {}) =>
                config
                |> prevConfig.config || emptyFunction.thatReturnsArgument
                |> newConfig.config || emptyFunction.thatReturnsArgument,
              ignore: (ignore: $ReadOnlyArray<string>) =>
                ignore
                |> prevConfig.ignore || emptyFunction.thatReturnsArgument
                |> newConfig.ignore || emptyFunction.thatReturnsArgument,
            };
          });
        });
      debugLog(oneOrArrayConfigs);
      debugLog(cache);

      return result;
    },
  };

  return result;
};

export default buildCache().load();
