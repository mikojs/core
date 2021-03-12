/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { emptyFunction } from 'fbjs';

import createLogger from '@mikojs/logger';

type configsType = {|
  cache: {|
    [string]: (config: {}) => {},
  |},
  load: (initialConfigs: ?initialConfigsType) => configsType,
|};

type initialConfigsType = {|
  config:
    | $PropertyType<configsType, 'cache'>
    | $ReadOnlyArray<$PropertyType<initialConfigsType, 'config'>>,
  filepath: string,
|};

const logger = createLogger('@mikojs/miko:configs');
const configs: configsType = {
  cache: {},

  /**
   * @param {initialConfigsType} initialConfigs - initial configs
   *
   * @return {configsType} - new configs
   */
  load: (initialConfigs: ?initialConfigsType): configsType => {
    if (!initialConfigs) return configs;

    const { config } = initialConfigs;

    logger.debug(initialConfigs, configs.cache);

    if (config instanceof Array)
      config.forEach(
        (initialConfig: $PropertyType<initialConfigsType, 'config'>) =>
          configs.load({ ...initialConfigs, config: initialConfig }),
      );
    else
      Object.keys(config).forEach((key: string) => {
        const prevConfigFunc =
          configs.cache[key] || emptyFunction.thatReturnsArgument;
        const newConfigFunc = config[key];

        /**
         * @param {object} init - prev config
         *
         * @return {object} - new config
         */
        configs.cache[key] = (init: {}) =>
          init |> prevConfigFunc |> newConfigFunc;
      });

    return configs;
  },
};

export default configs;
