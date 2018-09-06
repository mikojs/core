// @flow

import defaultConfigs from '.';

import cliOptions from 'utils/cliOptions';
import printInfo from 'utils/printInfo';

export default ((): mixed => {
  const { configs } = cliOptions;

  if (!process.env.USE_CONFIGS_SCRIPTS)
    return printInfo(['can not get config'], true);

  // Return real config
  const { USE_CONFIGS_SCRIPTS } = process.env;
  const useConfig =
    configs[USE_CONFIGS_SCRIPTS].config || configs[USE_CONFIGS_SCRIPTS];
  const useDefaultConfig =
    defaultConfigs[USE_CONFIGS_SCRIPTS].config ||
    defaultConfigs[USE_CONFIGS_SCRIPTS];

  delete process.env.USE_CONFIGS_SCRIPTS;

  return useConfig(useConfig === useDefaultConfig ? null : useDefaultConfig());
})();
