// @flow

import chalk from 'chalk';

import { typeof createLogger as createLoggerType } from '@mikojs/utils';

import configs from 'utils/configs';

/**
 * @example
 * validateCliName(logger, 'cliName')
 *
 * @param {createLoggerType} logger - logger functions
 * @param {string} cliName - cli name
 *
 * @return {boolean} - test result
 */
export default (
  logger: $Call<createLoggerType, string>,
  cliName: ?string,
): boolean => {
  if (!cliName) {
    logger
      .fail(chalk`Should give an argument at least`)
      .fail(chalk`Use {green \`-h\`} to get the more information`);
    return false;
  }

  if (!configs.get(cliName)) {
    logger
      .fail(chalk`Can not find {cyan \`${cliName}\`} in configs`)
      .fail(chalk`Use {green \`info\`} to get the more information`);
    return false;
  }

  return true;
};
