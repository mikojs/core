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
): configsType => {
  const configs = [
    ...(configsArrayOrOne instanceof Array
      ? configsArrayOrOne
      : [configsArrayOrOne]),
    {
      install: (): $ReadOnlyArray<string> => {
        const dependencies = ['yarn', 'install'];
        const devDependencies = ['yarn', 'install', '--dev'];

        Object.keys(configs).forEach((key: string) => {
          dependencies.push(...configs[key][1].dependencies);
          devDependencies.push(...configs[key][1].devDependencies);
        });

        return [...dependencies, '&&', ...devDependencies];
      },
    },
  ].reduce(
    (result: configsType, originalConfigs: originalConfigsType) =>
      merge(result, walker(originalConfigs)),
    {},
  );

  return configs;
};
