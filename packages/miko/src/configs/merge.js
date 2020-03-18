/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { emptyFunction } from 'fbjs';

import { type configsType } from './index';

/**
 * @example
 * merge(configs, newConfigs)
 *
 * @param {configsType} configs - prev configs
 * @param {configsType} newConfigs - new configs
 *
 * @return {configsType} - merged new configs
 */
export default (configs: configsType, newConfigs: configsType): configsType => {
  const prevConfigs = { ...configs };

  Object.keys(newConfigs).forEach((key: string) => {
    const [prevCommandsFunc, prevConfig] = prevConfigs[key] || [
      emptyFunction.thatReturnsArgument,
      {},
    ];
    const [newCommandsFunc, newConfig] = newConfigs[key];

    prevConfigs[key] = [
      (commands: $ReadOnlyArray<string>) =>
        commands |> prevCommandsFunc |> newCommandsFunc,
      {
        env: Object.keys(newConfig.env || {}).reduce(
          (
            result: $PropertyType<
              $ElementType<$ElementType<configsType, string>, 1>,
              'env',
            >,
            envName: string,
          ) => ({
            ...result,
            [envName]: newConfig.env?.[envName],
          }),
          prevConfig.env,
        ),
        dependencies: [
          ...(prevConfig.dependencies || []),
          ...(newConfig.dependencies || []),
        ],
        devDependencies: [
          ...(prevConfig.devDependencies || []),
          ...(newConfig.devDependencies || []),
        ],
      },
    ];
  });

  return prevConfigs;
};
