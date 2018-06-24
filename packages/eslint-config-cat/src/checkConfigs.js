// @flow

import { checkImport } from './import';

import type { configType } from './definitions/configType.js.flow';

/**
 * @example
 * checkConfigs({
 *   extends: ['@cat-org/eslint-config-cat'],
 *   rules: {
 *     'no-console': 'error',
 *   },
 * });
 *
 * @param {config} config - eslint configs
 * @return {config} - eslint configs
 */
export default (config: configType): configType => {
  checkImport(config);

  return config;
};
