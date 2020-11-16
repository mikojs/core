// @flow

import { type mikoConfigsType } from '@mikojs/miko';

/**
 * @param {mikoConfigsType} prevCommand - prev command
 * @param {string} defaultCommand - default command
 *
 * @return {string} - new command
 */
export default (
  prevCommand: ?$PropertyType<
    $PropertyType<mikoConfigsType, 'string'>,
    'command',
  >,
  defaultCommand: string,
): string => {
  const command =
    typeof prevCommand === 'function' ? prevCommand() : prevCommand;

  return command || defaultCommand;
};
