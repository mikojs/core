// @flow

import defaultConfigs from './defaultConfigs';

export default (configs: {}): {} => {
  const { USE_CONFIGS_SCRIPTS } = process.env;

  if (!USE_CONFIGS_SCRIPTS) return configs;

  // Return real config
  const useConfig =
    configs[USE_CONFIGS_SCRIPTS].config || configs[USE_CONFIGS_SCRIPTS];
  const useDefaultConfig =
    defaultConfigs[USE_CONFIGS_SCRIPTS].config ||
    defaultConfigs[USE_CONFIGS_SCRIPTS];

  delete process.env.USE_CONFIGS_SCRIPTS;

  return useConfig(useConfig === useDefaultConfig ? null : useDefaultConfig());
};
