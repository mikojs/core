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

export type returnType = {|
  get: (key: string) => objConfigType,
  all: () => $ReadOnlyArray<string>,
  addConfigsFilesToConfig: (
    key: string,
    configsFiles: $ReadOnlyArray<string>,
  ) => void,
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
  const cache: { [string]: objConfigType } = {};

  return {
    get: (key: string) => cache[key],

    all: () => Object.keys(cache),

    addConfigsFilesToConfig: (
      key: string,
      configsFiles: $ReadOnlyArray<string>,
    ) => {
      cache[key] = {
        ...cache[key],
        configsFiles: configsFiles.reduce(
          (
            result: $PropertyType<objConfigType, 'configsFiles'>,
            configsFilesName: string,
          ) => ({
            ...result,
            [configsFilesName]: true,
          }),
          cache[key]?.configsFiles || {},
        ),
      };
    },

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
          env: Object.keys(newConfig.env || {}).reduce(
            (result: $PropertyType<objConfigType, 'env'>, envName: string) => ({
              ...result,
              [envName]: newConfig.env?.[envName],
            }),
            prevConfig.env,
          ),
          configsFiles: Object.keys(newConfig.configsFiles || {}).reduce(
            (
              result: $PropertyType<objConfigType, 'configsFiles'>,
              configsFilesName: string,
            ) => ({
              ...result,
              [configsFilesName]: newConfig.configsFiles?.[configsFilesName],
            }),
            prevConfig.configsFiles,
          ),
        };
      });

      debugLog(cache);
    },
  };
};
