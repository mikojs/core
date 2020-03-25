/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { emptyFunction } from 'fbjs';
import debug from 'debug';

type configsType = {
  [string]: {
    filenames?: {|
      config?: string,
      ignore?: string,
    |},
    config?: (config: {}) => {},
    ignore?: (ignore: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  },
};

type initialConfigsType = {
  [string]:
    | $NonMaybeType<$PropertyType<$ElementType<configsType, string>, 'config'>>
    | $ElementType<configsType, string>,
};

export type cacheType = {|
  get: (configName: string) => $ElementType<configsType, string>,
  keys: () => $ReadOnlyArray<string>,
  init: (
    oneOrArrayConfigs: ?(
      | initialConfigsType
      | $ReadOnlyArray<initialConfigsType>
    ),
  ) => void,
|};

const debugLog = debug('miko:buildCache');

/**
 * @example
 * buildCache()
 *
 * @return {cacheType} - config cache
 */
export default (): cacheType => {
  const cache = {};

  return {
    get: (configName: string) => cache[configName],

    keys: () => Object.keys(cache),

    init: (
      oneOrArrayConfigs: ?(
        | initialConfigsType
        | $ReadOnlyArray<initialConfigsType>
      ),
    ) => {
      debugLog(oneOrArrayConfigs);
      (oneOrArrayConfigs instanceof Array
        ? oneOrArrayConfigs
        : [oneOrArrayConfigs]
      )
        .filter(Boolean)
        .forEach((configs: initialConfigsType) => {
          Object.keys(configs).forEach((key: string) => {
            const prevConfig = cache[key];
            const newConfig =
              typeof configs[key] !== 'function'
                ? configs[key]
                : { config: configs[key] };

            cache[key] = {
              filenames: {
                ...prevConfig[key].filenames,
                ...newConfig[key].filenames,
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
      debugLog(cache);
    },
  };
};
