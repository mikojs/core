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
      install: () => ['install:dependencies', '&&', 'install:devDependencies'],
      'install:dependencies': (): $ReadOnlyArray<string> => {
        const dependencies = ['yarn', 'install'];

        Object.keys(configs).forEach((key: string) => {
          dependencies.push(...configs[key][1].dependencies);
        });

        return dependencies.length === 2 ? [] : dependencies;
      },
      'install:devDependencies': (): $ReadOnlyArray<string> => {
        const devDependencies = ['yarn', 'install'];

        Object.keys(configs).forEach((key: string) => {
          devDependencies.push(...configs[key][1].devDependencies);
        });

        return devDependencies.length === 2 ? [] : devDependencies;
      },
    },
  ].reduce(
    (result: configsType, originalConfigs: originalConfigsType) =>
      merge(result, walker(originalConfigs)),
    {},
  );

  return configs;
};
