// @flow

import chalk from 'chalk';

import { createLogger } from '@mikojs/utils';
import {
  type fileDataType,
  type toolsType,
} from '@mikojs/merge-dir/lib/utils/tools';

/**
 * @param {string} type - log type
 * @param {string} name - command name
 * @param {createLogger} logger - command logger
 *
 * @return {toolsType} - tools.log
 */
export default (
  type: 'update' | 'done',
  name: string,
  logger: $Call<typeof createLogger, string>,
): ((fileData: fileDataType) => void) => (fileData: fileDataType) => {
  if (type === 'done') logger.succeed('The server is updated');
  else
    logger
      .info(
        fileData.exists
          ? chalk`File {green (${fileData.filePath})} is changed`
          : chalk`File {red (${fileData.filePath})} is removed`,
      )
      .start('The server is updating');
};
