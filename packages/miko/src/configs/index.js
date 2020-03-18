// @flow

import walker from './walker';
import merge from './merge';

type commandsType = (
  commands: $ReadOnlyArray<string>,
) => $ReadOnlyArray<string>;

type commandsArrayType = [
  commandsType,
  {|
    env?: {
      [string]: string,
    },
    dependencies?: $ReadOnlyArray<string>,
    devDependencies?: $ReadOnlyArray<string>,
  |},
];

export type originalConfigsType = {
  [string]: originalConfigsType | commandsType | commandsArrayType,
};

export type configsType = {
  [string]: [
    commandsType,
    {|
      env: {
        [string]: string,
      },
      dependencies: $ReadOnlyArray<string>,
      devDependencies: $ReadOnlyArray<string>,
    |},
  ],
};

/**
 * @example
 * getConfigs(configsArrayOrOne)
 *
 * @param {originalConfigsType} configsArrayOrOne - one configs or a configs array
 *
 * @return {configsType} - merged new configs
 */
export default (
  configsArrayOrOne: originalConfigsType | $ReadOnlyArray<originalConfigsType>,
): configsType =>
  (configsArrayOrOne instanceof Array
    ? configsArrayOrOne
    : [configsArrayOrOne]
  ).reduce(
    (result: configsType, configs: originalConfigsType) =>
      merge(result, walker(configs)),
    {},
  );
