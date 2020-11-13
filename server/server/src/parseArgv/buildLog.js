// @flow

import chalk from 'chalk';

import { createLogger } from '@mikojs/utils';
import {
  type fileDataType,
  type toolsType,
} from '@mikojs/merge-dir/lib/utils/tools';

/**
 * @param {string} name - command name
 * @param {createLogger} logger - command logger
 *
 * @return {toolsType} - tools.log
 */
export default (
  name: string,
  logger: $Call<typeof createLogger, string>,
): $NonMaybeType<$PropertyType<toolsType, 'log'>> => (
  fileData: fileDataType | 'done',
) => {
  if (fileData === 'done') logger.succeed('The server is updated');
  else
    logger
      .info(
        fileData.exists
          ? chalk`File {green (${fileData.filePath})} is changed`
          : chalk`File {red (${fileData.filePath})} is removed`,
      )
      .start('The server is updating');
};
