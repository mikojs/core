/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { emptyFunction } from 'fbjs';
import debug from 'debug';

export type configsType = {
  [string]: (config: {}) => {},
};

export type returnType = {|
  get: (configName: string) => $ElementType<configsType, string>,
  init: (
    oneOrArrayConfigs: ?(configsType | $ReadOnlyArray<configsType>),
  ) => void,
|};

const debugLog = debug('miko:buildCache');

/**
 * @example
 * buildCache()
 *
 * @return {returnType} - config cache
 */
export default (): returnType => {
  const cache = {};

  return {
    get: (configName: string) => cache[configName],

    init: (oneOrArrayConfigs: ?(configsType | $ReadOnlyArray<configsType>)) => {
      debugLog(oneOrArrayConfigs);
      (oneOrArrayConfigs instanceof Array
        ? oneOrArrayConfigs
        : [oneOrArrayConfigs]
      )
        .filter(Boolean)
        .forEach((configs: configsType) => {
          Object.keys(configs).forEach((key: string) => {
            const prevConfig = cache[key];
            const newConfig = configs[key];

            cache[key] = (configObj: {}) =>
              configObj
              |> prevConfig || emptyFunction.thatReturnsArgument
              |> newConfig || emptyFunction.thatReturnsArgument;
          });
        });
      debugLog(cache);
    },
  };
};
