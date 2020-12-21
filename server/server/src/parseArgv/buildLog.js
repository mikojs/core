// @flow

import chalk from 'chalk';

import {
  type fileDataType,
  type toolsType,
} from '@mikojs/merge-dir/lib/utils/tools';
import typeof createLoggerType from '@mikojs/logger';

/**
 * @param {string} type - log type
 * @param {string} name - command name
 * @param {createLoggerType} logger - command logger
 *
 * @return {toolsType} - tools.log
 */
export default (
  type: 'update' | 'done',
  name: string,
  logger: $Call<createLoggerType, string>,
): ((fileData: fileDataType) => void) => (fileData: fileDataType) => {
  if (type === 'done') {
    logger.success('The server is updated');
    return;
  }

  logger.info(
    fileData.exists
      ? chalk`File {green (${fileData.filePath})} is changed`
      : chalk`File {red (${fileData.filePath})} is removed`,
  );
  logger.start('The server is updating');
};
