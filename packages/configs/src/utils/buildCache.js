/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { emptyFunction } from 'fbjs';
import debug from 'debug';

import { type objConfigType, type configsType } from '../types';

type returnType = {|
  cache: { [string]: objConfigType },
  addConfig: (configs: configsType) => void,
|};

const debugLog = debug('configs:buildCache');

/**
 * @example
 * buildCache()
 *
 * @return {returnType} - cache data and functions
 */
export default (): returnType => {
  const cache = {};

  return {
    cache,

    addConfig: (configs: configsType) => {
      Object.keys(configs).forEach((key: string) => {
        const newConfig: objConfigType =
          typeof configs[key] !== 'function'
            ? configs[key]
            : { config: configs[key] };
        const prevConfig = cache[key];

        if (!prevConfig) {
          cache[key] = newConfig;
          return;
        }

        cache[key] = {
          alias: newConfig.alias || prevConfig.alias,
          install: (install: $ReadOnlyArray<string>) =>
            install
            |> prevConfig.install || emptyFunction.thatReturnsArgument
            |> newConfig.install || emptyFunction.thatReturnsArgument,
          config: (configObj: {}) =>
            configObj
            |> prevConfig.config || emptyFunction.thatReturnsArgument
            |> newConfig.config || emptyFunction.thatReturnsArgument,
          ignore: (ignore?: {|
            name?: string,
            ignore?: $ReadOnlyArray<string>,
          |}) =>
            ignore
            |> prevConfig.ignore || emptyFunction.thatReturnsArgument
            |> newConfig.ignore || emptyFunction.thatReturnsArgument,
          run: (argv: $ReadOnlyArray<string>) =>
            argv
            |> prevConfig.run || emptyFunction.thatReturnsArgument
            |> newConfig.run || emptyFunction.thatReturnsArgument,
          env: {
            ...(prevConfig.env || {}),
            ...(newConfig.env || {}),
          },
          configsFiles: {
            ...(prevConfig.configsFiles || {}),
            ...(newConfig.configsFiles || {}),
          },
        };
      });

      debugLog(cache);
    },
  };
};
