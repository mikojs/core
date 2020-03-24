/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { emptyFunction } from 'fbjs';

export type configsType = {
  [string]: (config: {}) => {},
};

export type returnType = {|
  get: () => configsType,
  init: (oneOrArrayConfigs: configsType | $ReadOnlyArray<configsType>) => void,
|};

/**
 * @example
 * buildCache()
 *
 * @return {returnType} - config cache
 */
export default (): returnType => {
  const cache = {};

  return {
    get: () => cache,

    init: (oneOrArrayConfigs: configsType | $ReadOnlyArray<configsType>) => {
      (oneOrArrayConfigs instanceof Array
        ? oneOrArrayConfigs
        : [oneOrArrayConfigs]
      ).forEach((configs: configsType) => {
        Object.keys(configs).forEach((key: string) => {
          const prevConfig = cache[key];
          const newConfig = configs[key];

          cache[key] = (configObj: {}) =>
            configObj
            |> prevConfig || emptyFunction.thatReturnsArgument
            |> newConfig || emptyFunction.thatReturnsArgument;
        });
      });
    },
  };
};
